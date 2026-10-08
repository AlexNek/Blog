$files = Get-ChildItem 'Y:\user_alex_new\dot_net2022\Github\Blog\docs\content' -Recurse -Filter "*.md"
foreach ($f in $files) {
    $text = Get-Content $f.FullName -Raw
    # Replace 3+ consecutive blank lines with 2
    $cleaned = $text -replace '(\r?\n){4,}', "`n`n`n"
    if ($cleaned -ne $text) {
        Set-Content -Path $f.FullName -Value $cleaned -Encoding UTF8 -NoNewline
        Write-Host "Trimmed blanks: $($f.Name)"
    }
}
