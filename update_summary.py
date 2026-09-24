import re

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix view-summary split panel
summary_match = re.search(r'<section id="view-summary" class="view-container">[\s\S]*?</section>', html)
if summary_match:
    summary_html = summary_match.group(0)
    
    new_summary_html = re.sub(
        r'<div id="doctorSummarySheet" class="summary-doctor-sheet">',
        '''<div class="split-panel">
    <div class="panel-left">
      <div class="doc-preview-container" style="background: var(--bg-card); border: 1.5px solid var(--border-card); border-radius: var(--radius-lg); height: 100%; min-height: 400px; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
         📄 Uploaded Document Preview
      </div>
    </div>
    <div class="panel-right">
      <div id="doctorSummarySheet" class="summary-doctor-sheet">''',
        summary_html
    )
    
    new_summary_html = re.sub(
        r'</section>',
        '''    </div>
  </div>
</section>''',
        new_summary_html
    )
    
    html = html.replace(summary_html, new_summary_html)
    
    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Summary updated')
