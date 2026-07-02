import sqlite3
conn = sqlite3.connect('sql_app.db')
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
print('Tables:', [r[0] for r in cur.fetchall()])
cur.execute('SELECT id, email, username, full_name, is_active FROM users;')
rows = cur.fetchall()
print(f'Total users: {len(rows)}')
for r in rows:
    print(f'  ID:{r[0]} | {r[1]} | @{r[2]} | {r[3]} | active:{r[4]}')
conn.close()
