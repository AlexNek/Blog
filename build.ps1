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
    '_site', 'en', 'de', 'posts', 'public',
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
# Clean DocFX vendor files in styles/ (legacy) and public/
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

# ── 2b. Restore custom public/ files (DocFX build overwrites them) ─────────
$publicDir = Join-Path $docsDir 'public'
$srcPublic = Join-Path $repoRoot 'src\public'
if ((Test-Path $srcPublic) -and (Test-Path $publicDir)) {
    Copy-Item (Join-Path $srcPublic 'main.js') (Join-Path $publicDir 'main.js') -Force
    Copy-Item (Join-Path $srcPublic 'main.css') (Join-Path $publicDir 'main.css') -Force
    Write-Host 'Restored custom public/main.js and public/main.css' -ForegroundColor Green
}

# ── 2c. Strip debug source maps and their references from the site output ───
# *.map files are only fetched by browser devtools; they are ~55% of the Pages
# payload and slow down the GitHub Pages deployment, so they are not published.
# The sourceMappingURL comments in minified files must also be removed, or the
# browser will 404 trying to fetch the deleted maps.
$mapFiles = @(Get-ChildItem $docsDir -Recurse -Filter '*.map' -ErrorAction SilentlyContinue)
if ($mapFiles.Count -gt 0) {
    $mapBytes = ($mapFiles | Measure-Object Length -Sum).Sum
    $mapFiles | Remove-Item -Force
    Write-Host ('Stripped {0} source maps ({1:N1} MB)' -f $mapFiles.Count, ($mapBytes / 1MB)) -ForegroundColor Green
}

$minFiles = @(Get-ChildItem $docsDir -Recurse -Include '*.min.js', '*.min.css' -ErrorAction SilentlyContinue)
$stripped = 0
foreach ($f in $minFiles) {
    $content = Get-Content $f.FullName -Raw
    if ($content -match '//# sourceMappingURL=.*\.map') {
        $content = $content -replace '//# sourceMappingURL=.*\.map\s*', ''
        Set-Content $f.FullName -Value $content -NoNewline
        $stripped++
    }
}
if ($stripped -gt 0) {
    Write-Host "Removed $stripped sourceMappingURL references" -ForegroundColor Green
}

# ── 2d. Inject GoatCounter analytics tracking script ────────────────────────
# The tracking snippet is injected into every HTML file before </head>.
# It is skipped on localhost so local development does not pollute analytics.
# CONFIGURATION: set $gcSite to your GoatCounter site name (the subdomain you
#                chose when creating the site at goatcounter.com).
#                Set $gcApiToken to the read-only API token from
#                GoatCounter → Settings → API token (needed for the on-page
#                view counter; leave empty to show only the dashboard).
$gcSite    = 'alex-nek-stat'
$gcApiToken = ''

Write-Host "Injecting GoatCounter analytics ($gcSite)…" -ForegroundColor Cyan
$gcSnippet = @"
<meta name="goatcounter:site" content="https://$gcSite.goatcounter.com">
<meta name="goatcounter:token" content="$gcApiToken">
<script data-goatcounter="https://$gcSite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
<script>
  // Disable GoatCounter on localhost / 127.0.0.1 so local dev is not tracked.
  (function(){
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '') {
      window.gc_skip = true;
      var s = document.querySelector('script[data-goatcounter]');
      if (s) s.remove();
    }
  })();
</script>
"@

$htmlFiles = @(Get-ChildItem $docsDir -Recurse -Filter '*.html' -ErrorAction SilentlyContinue)
$gcInjected = 0
foreach ($f in $htmlFiles) {
    $raw = Get-Content $f.FullName -Raw -Encoding UTF8
    if ($raw -match 'data-goatcounter') { continue }
    $raw = $raw -replace '</head>', "$gcSnippet`n</head>"
    Set-Content $f.FullName -Value $raw -Encoding UTF8 -NoNewline
    $gcInjected++
}
Write-Host "  GoatCounter injected into $gcInjected HTML file(s)" -ForegroundColor Green

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
    # Remove .md extension to get the slug
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

        # Cover image for the overview thumbnails: taken from the
        # `![cover](~/images/posts/<topic>/cover.png)` body line that follows the
        # frontmatter. The DocFX-only `~/` anchor (= the docs/ folder) is stripped and the
        # path is stored site-root-relative with a leading slash, because the JSON is read
        # by main.js, not by DocFX. main.js must prepend the resolved site root before
        # using it - a bare leading-slash URL resolves against the DOMAIN root and 404s
        # under the /Blog/ sub-path deployment.
        $cover = ''
        if ($body -match '!\[cover\]\(\s*<?([^)\s]+)') {
            $coverPath = $Matches[1] -replace '^~/', ''
            if ($coverPath -notmatch '^(?:https?:)?//') {
                $cover = '/' + $coverPath
            }
        }

        $entry = @{
            slug      = $slug
            title     = if ($fm.ContainsKey('title')) { $fm['title'] } else { $slug }
            date      = if ($fm.ContainsKey('date')) { $fm['date'] } else { '1970-01-01' }
            url       = $url
            excerpt   = $excerpt
            cover     = $cover
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

# EN and DE posts share identical filenames; the counterpart URL is just /en/ ↔ /de/
foreach ($post in $enPosts) {
    $counterpart = $post.url -replace '/en/', '/de/'
    $switcher[$post.url] = $counterpart
}
foreach ($post in $dePosts) {
    $counterpart = $post.url -replace '/de/', '/en/'
    $switcher[$post.url] = $counterpart
}

# Also map the landing pages
$switcher["$baseUrl/en/index.html"] = "$baseUrl/de/index.html"
$switcher["$baseUrl/de/index.html"] = "$baseUrl/en/index.html"

$switcherJson = $switcher | ConvertTo-Json -Depth 4
Set-Content -Path (Join-Path $siteDir 'language-switcher.json') -Value $switcherJson -Encoding UTF8

# ── 5. Done ───────────────────────────────────────────────────────────────────
$siteFiles = @(Get-ChildItem $docsDir -Recurse -File)
Write-Host ''
Write-Host 'Build complete!' -ForegroundColor Green
Write-Host "  Site output : $siteDir"
Write-Host "  Pages upload: $($siteFiles.Count) files, $([Math]::Round(($siteFiles | Measure-Object Length -Sum).Sum / 1MB, 1)) MB"
Write-Host "  Open        : $(Join-Path $siteDir 'index.html')"
Write-Host ''
