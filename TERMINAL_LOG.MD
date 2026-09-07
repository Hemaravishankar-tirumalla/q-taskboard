================================================================================
SAFE REAL AIRTABLE EXPORT DEMO CHECKLIST
Recorded: 2026-09-08

IMPORTANT GATE
- Do not run the real Airtable demo as a duplicate-proof until the exporter has
  idempotency keyed by Project ID + Task ID. The current exporter uses Airtable
  create() for every task, so repeating the export currently creates duplicates.
- This section is a runbook and evidence template. Empty evidence fields below
  must be replaced only after a real, successful run.

1. Airtable table setup

Create a table named Tasks with these fields. Keep Task ID as a single-line text
field and make it the visible uniqueness key used to find existing records.

| Field | Airtable type | Required | Source |
|---|---|---:|---|
| Task ID | Single line text | yes | Django task id |
| Project ID | Single line text | yes | Django project id |
| Title | Single line text | yes | task title |
| Description | Long text | no | task description |
| Status | Single select or single line text | yes | todo/in_progress/review/done |
| Assignee | Single line text | no | assignee name |
| Assignee Email | Email or single line text | no | assignee email |
| Created By | Single line text | yes | creator id |
| Created At | Date/time or single line text | yes | task created_at |
| Updated At | Date/time or single line text | yes | task updated_at |
| Position | Number | yes | task position |

Before the demo, verify that no unrelated rows share the Task ID values used by
the demo. Do not put an API token, bearer token, password, or secret in any
Airtable field, task title, screenshot, share link, shell history, or log.

2. Secure environment setup

Set these variables in the local environment or an ignored .env file. Use a
scoped Airtable Personal Access Token with only the minimum base permissions
needed to read and write the Tasks table. Never paste the token into this log.

AIRTABLE_API_KEY=<set locally; never print or commit>
AIRTABLE_BASE_ID=<base id only; not a secret>
AIRTABLE_TABLE_NAME=Tasks
EXPORTER_INTERNAL_TOKEN=<set locally; never print or commit>

The Django backend must use EXPORTER_SERVICE_URL=http://exporter:9000 and the
same internal token. Confirm .env is gitignored, and rotate/delete demo
credentials after testing. Do not request or display any Airtable API token.

3. First export evidence

Export command / button action:
- UI: Open the project as an admin or member and click "export to Airtable".
- CLI equivalent, with the token supplied by the local shell environment only:

  curl -sS -X POST "http://localhost:8000/api/projects/<project_id>/export" \
    -H "Authorization: Bearer <Django_user_token>" \
    -H "Content-Type: application/json"

Never paste a real JWT into this file. Replace it with <Django_user_token> in
captured evidence.

Successful export API response to capture (redacted example):

  {"ok":true,"projectId":"<project_id>","exported":2,"records":["rec...","rec..."]}

Recorded first response: [ ]
First response timestamp: [ ]
First export record count: [ ]

4. Airtable evidence requirement

Capture either:
- a screenshot of the Tasks grid showing the created task rows and Task ID; or
- a restricted read-only Airtable share link, recorded here without any token:

  Screenshot path: [ ]
  Safe read-only share link: [ ]

The screenshot/link must show the task titles, Task IDs, Project ID, and count.
Crop browser address bars, tokens, account identity, unrelated bases, and
private data. Do not make the base publicly editable.

5. Second export and duplicate proof

Run the same export again without changing the source tasks.

Second export command / button action: [ ]
Second export API response (redacted): [ ]
Expected idempotent result: exported=0, with existing records reported as
skipped/updated, or an equivalent explicit no-new-records response.

Second Airtable screenshot or safe share link: [ ]
Duplicate proof: the Airtable row count and unique Task ID count are unchanged;
record both counts here:

Before second export: rows [ ] / unique Task IDs [ ]
After second export:  rows [ ] / unique Task IDs [ ]
Duplicate count: [ ] (must be 0)

If the second response says exported=2 again or the row count increases, stop,
delete only the demo rows if appropriate, and report the idempotency failure.
Do not claim the export is duplicate-safe until this check passes.

6. Secret-handling confirmation

- [ ] No Airtable token appears in terminal output, this file, screenshots,
      browser URLs, Airtable fields, git diff, or issue/PR comments.
- [ ] Django user JWTs are redacted from evidence.
- [ ] Airtable credentials exist only in the exporter environment.
- [ ] Exporter internal authorization was enabled and not exposed to the UI.
- [ ] Demo credentials were rotated or removed after the test.
Script started on Tue Sep  8 02:36:34 2026
[1m[7m%[27m[1m[0m                                                                                                                                        
 

[0m[27m[24m[JHema.Tirumalla@IN-DRWMT26619 q-taskboard % [K[?2004h[7mcurl -sS -X PATCH "http://localhost:8000/api/tasks/<task_id>" \[27m

[7m    -H "Authorization: Bearer <non_member_token>" \[27m[K

[7m    -H "Content-Type: application/json" \[27m[K

[7m    -d '{"title":"HACKED","status":"done"}'[27m[K[3A[27mc[27mu[27mr[27ml[27m [27m-[27ms[27mS[27m [27m-[27mX[27m [27mP[27mA[27mT[27mC[27mH[27m [27m"[27mh[27mt[27mt[27mp[27m:[27m/[27m/[27ml[27mo[27mc[27ma[27ml[27mh[27mo[27ms[27mt[27m:[27m8[27m0[27m0[27m0[27m/[27ma[27mp[27mi[27m/[27mt[27ma[27ms[27mk[27ms[27m/[27m<[27mt[27ma[27ms[27mk[27m_[27mi[27md[27m>[27m"[27m [27m\[1B
[27m [27m [27m [27m [27m-[27mH[27m [27m"[27mA[27mu[27mt[27mh[27mo[27mr[27mi[27mz[27ma[27mt[27mi[27mo[27mn[27m:[27m [27mB[27me[27ma[27mr[27me[27mr[27m [27m<[27mn[27mo[27mn[27m_[27mm[27me[27mm[27mb[27me[27mr[27m_[27mt[27mo[27mk[27me[27mn[27m>[27m"[27m [27m\[1B
[27m [27m [27m [27m [27m-[27mH[27m [27m"[27mC[27mo[27mn[27mt[27me[27mn[27mt[27m-[27mT[27my[27mp[27me[27m:[27m [27ma[27mp[27mp[27ml[27mi[27mc[27ma[27mt[27mi[27mo[27mn[27m/[27mj[27ms[27mo[27mn[27m"[27m [27m\[1B
[27m [27m [27m [27m [27m-[27md[27m [27m'[27m{[27m"[27mt[27mi[27mt[27ml[27me[27m"[27m:[27m"[27mH[27mA[27mC[27mK[27mE[27mD[27m"[27m,[27m"[27ms[27mt[27ma[27mt[27mu[27ms[27m"[27m:[27m"[27md[27mo[27mn[27me[27m"[27m}[27m'[?2004l

<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title>Page not found at /api/tasks/&lt;task_id&gt;</title>
  <meta name="robots" content="NONE,NOARCHIVE">
  <style>
    html * { padding:0; margin:0; }
    body * { padding:10px 20px; }
    body * * { padding:0; }
    body { font-family: sans-serif; background:#eee; color:#000; }
    body > :where(header, main, footer) { border-bottom:1px solid #ddd; }
    h1 { font-weight:normal; margin-bottom:.4em; }
    h1 small { font-size:60%; color:#666; font-weight:normal; }
    table { border:none; border-collapse: collapse; width:100%; }
    td, th { vertical-align:top; padding:2px 3px; }
    th { width:12em; text-align:right; color:#666; padding-right:.5em; }
    #info { background:#f6f6f6; }
    #info ol { margin: 0.5em 4em; }
    #info ol li { font-family: monospace; }
    #summary { background: #ffc; }
    #explanation { background:#eee; border-bottom: 0px none; }
    pre.exception_value { font-family: sans-serif; color: #575757; font-size: 1.5em; margin: 10px 0 10px 0; }
  </style>
</head>
<body>
  <header id="summary">
    <h1>Page not found <small>(404)</small></h1>
    
    <table class="meta">
      <tr>
        <th scope="row">Request Method:</th>
        <td>PATCH</td>
      </tr>
      <tr>
        <th scope="row">Request URL:</th>
        <td>http://localhost:8000/api/tasks/%3Ctask_id%3E</td>
      </tr>
      
    </table>
  </header>

  <main id="info">
    
      <p>
      Using the URLconf defined in <code>taskboard.urls</code>,
      Django tried these URL patterns, in this order:
      </p>
      <ol>
        
          <li>
            
              <code>
                api/health
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                auth/register
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                auth/login
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                users/me
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/

                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/tasks
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/members
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/export
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                tasks/&lt;uuid:task_id&gt;
                
              </code>
            
          </li>
        
      </ol>
      <p>
        
          The current path, <code>api/tasks/&lt;task_id&gt;</code>,
        
        didn’t match any of these.
      </p>
    
  </main>

  <footer id="explanation">
    <p>
      You’re seeing this error because you have <code>DEBUG = True</code> in
      your Django settings file. Change that to <code>False</code>, and Django
      will display a standard 404 page.
    </p>
  </footer>
</body>
</html>
[1m[7m%[27m[1m[0m                                                                                                                                        
 

[0m[27m[24m[JHema.Tirumalla@IN-DRWMT26619 q-taskboard % [K[?2004h[7m curl -sS -X PATCH "http://localhost:8000/api/tasks/<task_id>" \[27m

[7m    -H "Authorization: Bearer <non_member_token>" \[27m[K

[7m    -H "Content-Type: application/json" \[27m[K

[7m    -d '{"title":"HACKED","status":"done"}'[27m[K[3A[27m [27mc[27mu[27mr[27ml[27m [27m-[27ms[27mS[27m [27m-[27mX[27m [27mP[27mA[27mT[27mC[27mH[27m [27m"[27mh[27mt[27mt[27mp[27m:[27m/[27m/[27ml[27mo[27mc[27ma[27ml[27mh[27mo[27ms[27mt[27m:[27m8[27m0[27m0[27m0[27m/[27ma[27mp[27mi[27m/[27mt[27ma[27ms[27mk[27ms[27m/[27m<[27mt[27ma[27ms[27mk[27m_[27mi[27md[27m>[27m"[27m [27m\[1B
[27m [27m [27m [27m [27m-[27mH[27m [27m"[27mA[27mu[27mt[27mh[27mo[27mr[27mi[27mz[27ma[27mt[27mi[27mo[27mn[27m:[27m [27mB[27me[27ma[27mr[27me[27mr[27m [27m<[27mn[27mo[27mn[27m_[27mm[27me[27mm[27mb[27me[27mr[27m_[27mt[27mo[27mk[27me[27mn[27m>[27m"[27m [27m\[1B
[27m [27m [27m [27m [27m-[27mH[27m [27m"[27mC[27mo[27mn[27mt[27me[27mn[27mt[27m-[27mT[27my[27mp[27me[27m:[27m [27ma[27mp[27mp[27ml[27mi[27mc[27ma[27mt[27mi[27mo[27mn[27m/[27mj[27ms[27mo[27mn[27m"[27m [27m\[1B
[27m [27m [27m [27m [27m-[27md[27m [27m'[27m{[27m"[27mt[27mi[27mt[27ml[27me[27m"[27m:[27m"[27mH[27mA[27mC[27mK[27mE[27mD[27m"[27m,[27m"[27ms[27mt[27ma[27mt[27mu[27ms[27m"[27m:[27m"[27md[27mo[27mn[27me[27m"[27m}[27m'[?2004l

<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title>Page not found at /api/tasks/&lt;task_id&gt;</title>
  <meta name="robots" content="NONE,NOARCHIVE">
  <style>
    html * { padding:0; margin:0; }
    body * { padding:10px 20px; }
    body * * { padding:0; }
    body { font-family: sans-serif; background:#eee; color:#000; }
    body > :where(header, main, footer) { border-bottom:1px solid #ddd; }
    h1 { font-weight:normal; margin-bottom:.4em; }
    h1 small { font-size:60%; color:#666; font-weight:normal; }
    table { border:none; border-collapse: collapse; width:100%; }
    td, th { vertical-align:top; padding:2px 3px; }
    th { width:12em; text-align:right; color:#666; padding-right:.5em; }
    #info { background:#f6f6f6; }
    #info ol { margin: 0.5em 4em; }
    #info ol li { font-family: monospace; }
    #summary { background: #ffc; }
    #explanation { background:#eee; border-bottom: 0px none; }
    pre.exception_value { font-family: sans-serif; color: #575757; font-size: 1.5em; margin: 10px 0 10px 0; }
  </style>
</head>
<body>
  <header id="summary">
    <h1>Page not found <small>(404)</small></h1>
    
    <table class="meta">
      <tr>
        <th scope="row">Request Method:</th>
        <td>PATCH</td>
      </tr>
      <tr>
        <th scope="row">Request URL:</th>
        <td>http://localhost:8000/api/tasks/%3Ctask_id%3E</td>
      </tr>
      
    </table>
  </header>

  <main id="info">
    
      <p>
      Using the URLconf defined in <code>taskboard.urls</code>,
      Django tried these URL patterns, in this order:
      </p>
      <ol>
        
          <li>
            
              <code>
                api/health
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                auth/register
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                auth/login
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                users/me
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/tasks
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/members
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/export
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                tasks/&lt;uuid:task_id&gt;
                
              </code>
            
          </li>
        
      </ol>
      <p>
        
          The current path, <code>api/tasks/&lt;task_id&gt;</code>,
        
        didn’t match any of these.
      </p>
    
  </main>

  <footer id="explanation">
    <p>
      You’re seeing this error because you have <code>DEBUG = True</code> in
      your Django settings file. Change that to <code>False</code>, and Django
      will display a standard 404 page.
    </p>
  </footer>
</body>
</html>
[1m[7m%[27m[1m[0m                                                                                                                                        
 

[0m[27m[24m[JHema.Tirumalla@IN-DRWMT26619 q-taskboard % [K[?2004hcclear[?2004l

[3J[H[2J[1m[7m%[27m[1m[0m                                                                                                                                        
 

[0m[27m[24m[JHema.Tirumalla@IN-DRWMT26619 q-taskboard % [K[?2004h[7mcurl -sS -D - -o /tmp/task_patch_out.txt \[27m

[7m  -X PATCH "http://localhost:8000/api/tasks/<task_id>" \[27m[K

[7m  -H "Authorization: Bearer <non_member_token>" \[27m[K

[7m  -H "Content-Type: application/json" \[27m[K

[7m  -d '{"title":"HACKED","status":"done"}' \[27m[K

[7m  && echo "--- BODY ---" && cat /tmp/task_patch_out.txt[27m[K[5A[12D[27mc[27mu[27mr[27ml[27m [27m-[27ms[27mS[27m [27m-[27mD[27m [27m-[27m [27m-[27mo[27m [27m/[27mt[27mm[27mp[27m/[27mt[27ma[27ms[27mk[27m_[27mp[27ma[27mt[27mc[27mh[27m_[27mo[27mu[27mt[27m.[27mt[27mx[27mt[27m [27m\[1B
[27m [27m [27m-[27mX[27m [27mP[27mA[27mT[27mC[27mH[27m [27m"[27mh[27mt[27mt[27mp[27m:[27m/[27m/[27ml[27mo[27mc[27ma[27ml[27mh[27mo[27ms[27mt[27m:[27m8[27m0[27m0[27m0[27m/[27ma[27mp[27mi[27m/[27mt[27ma[27ms[27mk[27ms[27m/[27m<[27mt[27ma[27ms[27mk[27m_[27mi[27md[27m>[27m"[27m [27m\[1B
[27m [27m [27m-[27mH[27m [27m"[27mA[27mu[27mt[27mh[27mo[27mr[27mi[27mz[27ma[27mt[27mi[27mo[27mn[27m:[27m [27mB[27me[27ma[27mr[27me[27mr[27m [27m<[27mn[27mo[27mn[27m_[27mm[27me[27mm[27mb[27me[27mr[27m_[27mt[27mo[27mk[27me[27mn[27m>[27m"[27m [27m\[1B
[27m [27m [27m-[27mH[27m [27m"[27mC[27mo[27mn[27mt[27me[27mn[27mt[27m-[27mT[27my[27mp[27me[27m:[27m [27ma[27mp[27mp[27ml[27mi[27mc[27ma[27mt[27mi[27mo[27mn[27m/[27mj[27ms[27mo[27mn[27m"[27m [27m\[1B
[27m [27m [27m-[27md[27m [27m'[27m{[27m"[27mt[27mi[27mt[27ml[27me[27m"[27m:[27m"[27mH[27mA[27mC[27mK[27mE[27mD[27m"[27m,[27m"[27ms[27mt[27ma[27mt[27mu[27ms[27m"[27m:[27m"[27md[27mo[27mn[27me[27m"[27m}[27m'[27m [27m\[1B
[27m [27m [27m&[27m&[27m [27me[27mc[27mh[27mo[27m [27m"[27m-[27m-[27m-[27m [27mB[27mO[27mD[27mY[27m [27m-[27m-[27m-[27m"[27m [27m&[27m&[27m [27mc[27ma[27mt[27m [27m/[27mt[27mm[27mp[27m/[27mt[27ma[27ms[27mk[27m_[27mp[27ma[27mt[27mc[27mh[27m_[27mo[27mu[27mt[27m.[27mt[27mx[27mt[?2004l

HTTP/1.1 404 Not Found

Date: Mon, 07 Sep 2026 21:41:22 GMT

Server: WSGIServer/0.2 CPython/3.12.14

Content-Type: text/html; charset=utf-8

Content-Length: 4604

Vary: origin



--- BODY ---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title>Page not found at /api/tasks/&lt;task_id&gt;</title>
  <meta name="robots" content="NONE,NOARCHIVE">
  <style>
    html * { padding:0; margin:0; }
    body * { padding:10px 20px; }
    body * * { padding:0; }
    body { font-family: sans-serif; background:#eee; color:#000; }
    body > :where(header, main, footer) { border-bottom:1px solid #ddd; }
    h1 { font-weight:normal; margin-bottom:.4em; }
    h1 small { font-size:60%; color:#666; font-weight:normal; }
    table { border:none; border-collapse: collapse; width:100%; }
    td, th { vertical-align:top; padding:2px 3px; }
    th { width:12em; text-align:right; color:#666; padding-right:.5em; }
    #info { background:#f6f6f6; }
    #info ol { margin: 0.5em 4em; }
    #info ol li { font-family: monospace; }
    #summary { background: #ffc; }
    #explanation { background:#eee; border-bottom: 0px none; }
    pre.exception_value { font-family: sans-serif; color: #575757; font-size: 1.5em; margin: 10px 0 10px 0; }
  </style>
</head>
<body>
  <header id="summary">
    <h1>Page not found <small>(404)</small></h1>
    
    <table class="meta">
      <tr>
        <th scope="row">Request Method:</th>
        <td>PATCH</td>
      </tr>
      <tr>
        <th scope="row">Request URL:</th>
        <td>http://localhost:8000/api/tasks/%3Ctask_id%3E</td>
      </tr>
      
    </table>
  </header>

  <main id="info">
    
      <p>
      Using the URLconf defined in <code>taskboard.urls</code>,
      Django tried these URL patterns, in this order:
      </p>
      <ol>
        
          <li>
            
              <code>
                api/health
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                auth/register
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                auth/login
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                users/me
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/tasks
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/members
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                projects/&lt;uuid:project_id&gt;/export
                
              </code>
            
          </li>
        
          <li>
            
              <code>
                api/
                
              </code>
            
              <code>
                tasks/&lt;uuid:task_id&gt;
                
              </code>
            
          </li>
        
      </ol>
      <p>
        
          The current path, <code>api/tasks/&lt;task_id&gt;</code>,
        
        didn’t match any of these.
      </p>
    
  </main>

  <footer id="explanation">
    <p>
      You’re seeing this error because you have <code>DEBUG = True</code> in
      your Django settings file. Change that to <code>False</code>, and Django
      will display a standard 404 page.
    </p>
  </footer>
</body>
</html>
[1m[7m%[27m[1m[0m                                                                                                                                        
 

[0m[27m[24m[JHema.Tirumalla@IN-DRWMT26619 q-taskboard % [K[?2004hcckc clear[?2004l

[3J[H[2J[1m[7m%[27m[1m[0m                                                                                                                                        
 

[0m[27m[24m[JHema.Tirumalla@IN-DRWMT26619 q-taskboard % [K[?2004hggit add    g  ddocket  r aompose       compose exec backend python -m pytest doc    docker-composr e exec fronten d npm test[?2004l
[1m========================================================== test session starts ==========================================================[0m
platform linux -- Python 3.12.14, pytest-8.4.2, pluggy-1.6.0
django: version: 5.2.17, settings: taskboard.settings (from ini)
rootdir: /app
configfile: pytest.ini
plugins: django-4.14.0
[1mcollecting ... [0m[1mcollected 0 items                                                                                                                       [0m

[33m========================================================= [33mno tests ran[0m[33m in 0.00s[0m[33m =========================================================[0m
[31mERROR: file or directory not found: docker-compose
[0m

[1mWhat's next:[0m
    Debug this Compose error with Gordon → docker ai "help me fix this compose error"
[1m[7m%[27m[1m[0m                                                                                                                                         [0m[27m[24m[JHema.Tirumalla@IN-DRWMT26619 q-taskboard % [K[?2004h