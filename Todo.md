## Todos:
- feedback für validator errors

- Implement mechanic for scheduling trains
    - plan trains-table (unique datetime, capacity, number of sold tickets)
    - server-side function
    - schedule next 2 months (30 days) on startup
    - reschedule after 1 month
    - delete trains if destination_at is a date before today

- Implement trip planner mechanic (shortest route from a to b)
    - Get trains by datetime

### Backend:
- Error handling: Catch sql errors and send to client
- Expand database.js and api to the growing database
    - plan table relations (use lecture as guide)

### Security:
- JWT Tokens for authorization (done!)
- mail verification (done!)	 
- limit login attempts to 5 per hour
- delete unconfirmed users after 24 hours
- password reset option
- rate limiter for post request on login/signup
- recaptcha on sign up

### Frontend:
- Home-page with map of trains and form for searching train connections 
    - Maybe show timetable 
        - define in timetable.js
        - define rest-path for requests
        - show on webpage as html table
- Remove outline effect on focused inputs
- DTO-Typed forms (honeypots rausnehmen schwierig...)

### Database:
- Plan further tables
    - plan how to schedule trains (when to add new trains?)
    - train timetable
    - trains 
    - Sold tickets


### Backlog:
- RxJS genau anschauen: https://www.youtube.com/watch?v=tGWBy6Vqq9w (13:41)
- using only get and post ok?
- Learn about SSL encryption, so data can be safely transferred through https(!) requests
- Learn about OpenID Connect and other auth frameworks