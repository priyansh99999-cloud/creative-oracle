$oldPhoneRegex = '<div style="display: flex; align-items: center; gap: 0\.5rem;">📞 \+91 79997 35764</div>'
$newPhone = '<div style="display: flex; align-items: center; gap: 0.5rem;">📞 <a href="tel:+917999735764" onmouseout="this.style.color=''var(--text-secondary)''" onmouseover="this.style.color=''var(--accent)''" style="color: var(--text-secondary); text-decoration: none; transition: color 0.3s;" data-event="phone_click">+91 79997 35764</a></div>'

$oldSocialRegex = '(?s)<div class="footer-social-links" style="display: flex; gap: 1rem;">.*?</div>'
$newSocial = '<div class="footer-social-links" style="display: flex; gap: 1rem;">
<a href="https://www.linkedin.com/company/creative-oracle" target="_blank" aria-label="LinkedIn" onmouseout="this.style.color=''var(--text-tertiary)''" onmouseover="this.style.color=''var(--accent)''" style="color: var(--text-tertiary); transition: color 0.3s;"><svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="20"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect height="12" width="4" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
<a href="https://www.instagram.com/creative__oracle/" target="_blank" aria-label="Instagram" onmouseout="this.style.color=''var(--text-tertiary)''" onmouseover="this.style.color=''var(--accent)''" style="color: var(--text-tertiary); transition: color 0.3s;"><svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="20"><rect height="20" rx="5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"></path></svg></a>
</div>'

Get-ChildItem -Filter *.html | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    $content = [regex]::Replace($content, $oldPhoneRegex, $newPhone)
    $content = [regex]::Replace($content, $oldSocialRegex, $newSocial)
    [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
}
