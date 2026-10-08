$files = Get-ChildItem 'Y:\user_alex_new\dot_net2022\Github\Blog\docs\content' -Recurse -Filter "*.md"
foreach ($f in $files) {
    $lines = Get-Content $f.FullName
    $newLines = $lines | Where-Object { $_ -notmatch '<a href.*(?:Read in English|Deutsch lesen|data-lang-switcher)' }
    if ($newLines.Count -ne $lines.Count) {
        Set-Content -Path $f.FullName -Value $newLines -Encoding UTF8
        Write-Host "Cleaned: $($f.Name)"
    }
}
