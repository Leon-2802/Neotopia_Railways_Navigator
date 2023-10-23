## Todos:
- Look up Dto, implement it
- SQL error catching -> send in response

### Backend:
- Error handling: Catch sql errors and send to client
- Research about CORS policy -> maybe remove wildcard origin
- Expand database.js and api to the growing database

### Security:
- JWT Tokens for authorization (done!)
- mail verification
- password reset option
- rate limiter for post request on login/signup
- recaptcha on sign up

### Frontend:
- Home-page with map of trains and form for searching train connections 
    - dialogue for user profile modifications
    - confirm dialogue for log out
- Show error messages if login/signup fails (messages somehow stopped be interceptor)

### Database:
- Plan further tables
    - plan how to schedule trains (when to add new trains?)
    - train timetable
    - trains 
    - Sold tickets


### Backlog:
- RxJS genau anschauen: https://www.youtube.com/watch?v=tGWBy6Vqq9w (13:41)
- Learn about SSL encryption, so data can be safely transferred through https(!) requests
- Learn about OpenID Connect and other auth frameworks