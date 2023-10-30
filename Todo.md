## Todos:
- Fix problem with conversion of sql date to js date (https://deepinthecode.com/2014/08/05/converting-a-sql-datetime-to-a-javascript-date/)
- resend option für confirm-email
- feedback für validator errors

-> start with Ticket selling

### Backend:
- Error handling: Catch sql errors and send to client
- Expand database.js and api to the growing database
    - plan table relations (use lecture as guide)

### Security:
- JWT Tokens for authorization (done!)
- mail verification (done!)	 
- delete unconfirmed users after 24 hours
- password reset option
- rate limiter for post request on login/signup
- recaptcha on sign up

### Frontend:
- Home-page with map of trains and form for searching train connections 
    - dialogue for user profile modifications
        - reset password
        - delete account
    - confirm dialogue for log out
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