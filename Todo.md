## Todos:
- mail verification
    - test if mail is actually being sent
        - if not learn more about nodemailer (if it works best to learn it anyways)
    - add the confirmation route (7:29 https://www.youtube.com/watch?v=76tKpVbjhu8)
    - make login only possible as soon as user is confirmed
- password reset option

-> start with Ticket selling

### Backend:
- Error handling: Catch sql errors and send to client
- Expand database.js and api to the growing database
    - plan table relations (use lecture as guide)

### Security:
- JWT Tokens for authorization (done!)
- mail verification
- password reset option
- rate limiter for post request on login/signup
- recaptcha on sign up

### Frontend:
- Home-page with map of trains and form for searching train connections 
    - dialogue for user profile modifications
        - reset password
        - delete account
    - confirm dialogue for log out
- Show error messages if login/signup fails (messages somehow stopped be interceptor)
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