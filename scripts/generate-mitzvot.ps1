$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$apiBase = "https://www.sefaria.org/api/texts"
$positiveUrl = "$apiBase/Sefer_HaMitzvot%2C_Positive_Commandments.1-248?context=0"
$negativeUrl = "$apiBase/Sefer_HaMitzvot%2C_Negative_Commandments.1-365?context=0"

function ConvertTo-PlainText($value) {
  if ($value -is [System.Array]) {
    return (($value | ForEach-Object { ConvertTo-PlainText $_ }) -join " ")
  }

  $text = [string]$value
  $text = [regex]::Replace($text, "<[^>]+>", "")
  $text = [System.Net.WebUtility]::HtmlDecode($text)
  return [regex]::Replace($text, "\s+", " ").Trim()
}

function Get-OpeningSummary($value) {
  $text = ConvertTo-PlainText $value
  $parts = [regex]::Split($text, "(?<=[,.;:])\s+")
  $summary = $parts[0].Trim()

  if ($summary.Length -lt 55 -and $parts.Count -gt 1) {
    $summary = "$summary $($parts[1].Trim())"
  }

  if ($summary.Length -gt 260) {
    $cutAt = $summary.LastIndexOf(" ", 259)
    if ($cutAt -lt 120) { $cutAt = 259 }
    $summary = $summary.Substring(0, $cutAt).TrimEnd(',', ';', ':', '.') + "…"
  } else {
    $summary = $summary.TrimEnd(',', ';', ':', '.') + "."
  }

  return $summary
}

$positive = (Invoke-RestMethod -Uri $positiveUrl).he
$negative = (Invoke-RestMethod -Uri $negativeUrl).he

if ($positive.Count -ne 248 -or $negative.Count -ne 365) {
  throw "Unexpected source count: $($positive.Count) positive, $($negative.Count) negative."
}

$records = [System.Collections.Generic.List[object]]::new()

for ($index = 0; $index -lt $positive.Count; $index++) {
  $number = $index + 1
  $records.Add([ordered]@{
    kind = "מצוות עשה"
    number = $number
    summary = Get-OpeningSummary $positive[$index]
    source = "ספר המצוות לרמב״ם, מצוות עשה $number"
    sourceUrl = "https://www.sefaria.org/Sefer_HaMitzvot,_Positive_Commandments.${number}?lang=he"
  })
}

for ($index = 0; $index -lt $negative.Count; $index++) {
  $number = $index + 1
  $records.Add([ordered]@{
    kind = "מצוות לא תעשה"
    number = $number
    summary = Get-OpeningSummary $negative[$index]
    source = "ספר המצוות לרמב״ם, מצוות לא תעשה $number"
    sourceUrl = "https://www.sefaria.org/Sefer_HaMitzvot,_Negative_Commandments.${number}?lang=he"
  })
}

$json = $records | ConvertTo-Json -Depth 4
$output = "// Generated from Sefaria's Sefer HaMitzvot Hebrew text (Warsaw 1883).`nwindow.MITZVOT = $json;`n"
$outputPath = Join-Path $projectRoot "docs/mitzvot.js"
[System.IO.File]::WriteAllText($outputPath, $output, [System.Text.UTF8Encoding]::new($false))

Write-Output "Generated $($records.Count) commandments at $outputPath"
