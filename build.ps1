#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Builds the bilingual blog and generates posts JSON + language-switcher map.
.DESCRIPTION
    1. Ensures the docfx global tool is installed.
    2. Runs docfx build on docs/docfx.json.
    3. Generates posts-en.json and posts-de.json into docs/_site/.
    4. Generates language-switcher.json into docs/_site/.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$docsDir    = Join-Path $repoRoot 'docs'
$siteDir    = $docsDir
$contentDir = Join-Path $docsDir 'content'

# ── 1. Ensure docfx is available ──────────────────────────────────────────────
$docfxCmd = Get-Command docfx -ErrorAction SilentlyContinue
if (-not $docfxCmd) {
    Write-Host 'docfx not found — installing as a global tool…' -ForegroundColor Yellow
    dotnet tool install -g docfx
    # Refresh the command lookup after install
    $docfxCmd = Get-Command docfx -ErrorAction SilentlyContinue
    if (-not $docfxCmd) {
        # Fallback: try the dotnet-tools path directly
        $toolPath = Join-Path $env:USERPROFILE '.dotnet\tools\docfx.exe'
        if (Test-Path $toolPath) {
            $docfxCmd = $toolPath
        } else {
            Write-Error 'docfx could not be found after installation. Please restart your shell.'
            exit 1
        }
    }
}

# ─ 2. Clean build artifacts and rebuild with DocFX ────────────────────────
# Remove previous build output from docs/ root (keep source: content/, docfx.json, images/)
$buildArtifacts = @(
    '_site', 'en', 'de', 'posts',
    'index.html', 'about.html', 'toc.html',
    'index.json', 'toc.json', 'xrefmap.yml',
    'favicon.ico', 'logo.svg', 'manifest.json', 'search-stopwords.json',
    'posts-en.json', 'posts-de.json', 'language-switcher.json'
)
foreach ($item in $buildArtifacts) {
    $path = Join-Path $docsDir $item
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path
    }
}
# Clean DocFX vendor files in styles/
$stylesDir = Join-Path $docsDir 'styles'
if (Test-Path $stylesDir) {
    Get-ChildItem $stylesDir -Filter 'docfx*' | Remove-Item -Recurse -Force
}

Write-Host 'Building site with DocFX…' -ForegroundColor Cyan
$docfxJson = Join-Path $docsDir 'docfx.json'
& $docfxCmd build $docfxJson
if ($LASTEXITCODE -ne 0) {
    Write-Error 'DocFX build failed.'
    exit $LASTEXITCODE
}

# ── 2b. Restore custom styles (DocFX build may overwrite them) ─────────────
$srcStyles = Join-Path $repoRoot 'src\styles'
if (Test-Path $srcStyles) {
    Copy-Item (Join-Path $srcStyles 'main.js') (Join-Path $stylesDir 'main.js') -Force
    Copy-Item (Join-Path $srcStyles 'main.css') (Join-Path $stylesDir 'main.css') -Force
    Write-Host 'Restored custom main.js and main.css' -ForegroundColor Green
}

# ── 3. Generate posts JSON per language ───────────────────────────────────────
Write-Host 'Generating posts JSON files…' -ForegroundColor Cyan

function Get-PostFiles {
    param([string]$LangDir)
    $postsDir = Join-Path $LangDir 'posts'
    if (Test-Path $postsDir) {
        Get-ChildItem -Path $postsDir -Filter '*.md' | Sort-Object Name
    }
}

function Parse-Frontmatter {
    param([string]$FilePath)
    $raw = Get-Content $FilePath -Raw -Encoding UTF8
    $fm = @{}

    if ($raw -match '(?s)^---\r?\n(.*?)\r?\n---') {
        $yamlBlock = $Matches[1]
        foreach ($line in ($yamlBlock -split "`n")) {
            $line = $line.Trim()
            if ($line -match '^(\w+):\s*(.+)$') {
                $key = $Matches[1]
                $val = $Matches[2].Trim()
                # Strip surrounding quotes
                $val = $val -replace '^"(.*)"$', '$1'
                # Parse YAML arrays [a, b, c]
                if ($val -match '^\[(.+)\]$') {
                    $fm[$key] = @($Matches[1] -split ',' | ForEach-Object { $_.Trim().Trim('"').Trim("'") })
                } else {
                    $fm[$key] = $val
                }
            }
        }
    }

    # Extract body (everything after the second ---)
    $body = $raw -replace '(?s)^---.*?---\s*', ''
    $fm['_body'] = $body.Trim()
    return $fm
}

function Get-SlugFromFile {
    param([string]$FileName)
    # Remove .md extension; filename is already YYYY-MM-DD-slug format
    return ($FileName -replace '\.md$', '')
}

function Build-PostEntries {
    param(
        [string]$LangDir,
        [string]$Lang,
        [string]$BaseUrl
    )

    $postFiles = Get-PostFiles -LangDir $LangDir
    $entries = @()

    foreach ($file in $postFiles) {
        $fm = Parse-Frontmatter -FilePath $file.FullName
        $slug = Get-SlugFromFile -FileName $file.Name

        # Determine URL relative to site root
        if ($Lang -eq 'en') {
            $url = "$BaseUrl/en/posts/$slug.html"
        } else {
            $url = "$BaseUrl/de/posts/$slug.html"
        }

        # Excerpt: use frontmatter 'excerpt' if present, else first paragraph of body
        $excerpt = ''
        if ($fm.ContainsKey('excerpt')) {
            $excerpt = $fm['excerpt']
        } else {
            $body = $fm['_body']
            # First non-empty, non-heading line block
            $paragraphs = $body -split "`n`n"
            foreach ($p in $paragraphs) {
                $p = $p.Trim()
                if ($p -and $p -notmatch '^#' -and $p -notmatch '^<') {
                    $excerpt = ($p -replace '\r?\n', ' ').Trim()
                    if ($excerpt.Length -gt 200) {
                        $excerpt = $excerpt.Substring(0, 200) + '…'
                    }
                    break
                }
            }
        }

        # Word count for reading time
        $body = $fm['_body']
        $words = ($body -split '\s+' | Where-Object { $_ -match '\w' }).Count

        $entry = @{
            slug      = $slug
            title     = if ($fm.ContainsKey('title')) { $fm['title'] } else { $slug }
            date      = if ($fm.ContainsKey('date')) { $fm['date'] } else { '1970-01-01' }
            url       = $url
            excerpt   = $excerpt
            wordCount = $words
            tags      = if ($fm.ContainsKey('tags')) { @($fm['tags']) } else { @() }
            categories = if ($fm.ContainsKey('categories')) { @($fm['categories']) } else { @() }
        }
        $entries += $entry
    }

    # Sort newest first
    return @($entries | Sort-Object { [datetime]$_.date } -Descending)
}

# Determine base URL (GitHub Pages subpath)
$baseUrl = '/Blog'

$enDir = Join-Path $contentDir 'en'
$deDir = Join-Path $contentDir 'de'

$enPosts = @(Build-PostEntries -LangDir $enDir -Lang 'en' -BaseUrl $baseUrl)
$dePosts = @(Build-PostEntries -LangDir $deDir -Lang 'de' -BaseUrl $baseUrl)

# ConvertTo-Json unwraps single-element arrays to scalars; fix categories/tags in post-processing
$enJson = ConvertTo-Json -InputObject @($enPosts) -Depth 4
$deJson = ConvertTo-Json -InputObject @($dePosts) -Depth 4

function Fix-JsonScalarArrays {
    param([string]$Json)
    # Wrap scalar values for "categories" and "tags" back into arrays
    # Matches: "categories": "value"  →  "categories": ["value"]
    $Json = $Json -replace '"categories":\s*"([^"]*)"', '"categories": ["$1"]'
    $Json = $Json -replace '"tags":\s*"([^"]*)"', '"tags": ["$1"]'
    return $Json
}

$enJson = Fix-JsonScalarArrays -Json $enJson
$deJson = Fix-JsonScalarArrays -Json $deJson

# Ensure arrays even if empty
if (-not $enJson) { $enJson = '[]' }
if (-not $deJson) { $deJson = '[]' }

Set-Content -Path (Join-Path $siteDir 'posts-en.json') -Value $enJson -Encoding UTF8
Set-Content -Path (Join-Path $siteDir 'posts-de.json') -Value $deJson -Encoding UTF8

# ── 4. Generate language-switcher.json ────────────────────────────────────────
Write-Host 'Generating language-switcher.json…' -ForegroundColor Cyan

$switcher = @{}

# Explicit translation pairs (EN slug -> DE slug)
$translationPairs = @{
    '2025-10-08-ddd-for-developers'                = '2025-10-08-ddd-fuer-entwickler'
    '2024-12-27-building-software-right'         = '2024-12-30-software-richtig-entwickeln'
    '2024-12-12-blazor-for-developers'           = '2024-12-13-blazor-fuer-entwickler'
    '2025-01-28-blazor-component-testing-bunit'  = '2025-01-28-blazor-komponententests-mit-bunit'
    '2024-11-04-blazor-for-managers'             = '2024-11-04-blazor-fuer-manager'
    '2024-10-21-ai-for-programmers'              = '2024-10-21-ki-fuer-programmierer'
}

foreach ($enSlug in $translationPairs.Keys) {
    $deSlug = $translationPairs[$enSlug]
    $enPost = $enPosts | Where-Object { $_.slug -eq $enSlug } | Select-Object -First 1
    $dePost = $dePosts | Where-Object { $_.slug -eq $deSlug } | Select-Object -First 1
    if ($enPost -and $dePost) {
        $switcher[$enPost.url] = $dePost.url
        $switcher[$dePost.url] = $enPost.url
    }
}

# Also map the landing pages
$switcher["$baseUrl/en/index.html"] = "$baseUrl/de/index.html"
$switcher["$baseUrl/de/index.html"] = "$baseUrl/en/index.html"

$switcherJson = $switcher | ConvertTo-Json -Depth 4
Set-Content -Path (Join-Path $siteDir 'language-switcher.json') -Value $switcherJson -Encoding UTF8

# ── 5. Done ───────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host 'Build complete!' -ForegroundColor Green
Write-Host "  Site output : $siteDir"
Write-Host "  Open        : $(Join-Path $siteDir 'index.html')"
Write-Host ''
