## Todos:
- clean up authentication: https://www.youtube.com/watch?v=foUS5JlDlCs

- Angular 17 -> watch:
    - https://www.youtube.com/watch?v=iA6iyoantuo
    - https://www.youtube.com/watch?v=z7zK2u4vBrA
    -> use signals?

- Implement mechanic for scheduling trains
    - plan trains-table (unique datetime, capacity, number of sold tickets)
    - server-side function
    - schedule next 2 months (30 days) on startup
    - reschedule after 1 month
    - delete trains if destination_at is a date before today

- Implement trip planner mechanic (shortest route from a to b)
    - Get trains by datetime 
        - Typed Observables with ts version of train object
        - user async pipe https://www.youtube.com/watch?v=kb9CBd2c4uA&list=PLvLBrJpVwC7oDMei6JYcySgH1hMBZti_a&index=32
        -> declarative code https://www.youtube.com/watch?v=-CoVmNvp_1g (4:50)

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
- Buy tickets and store in db through api
- DTO-Typed forms (honeypots rausnehmen schwierig...)

### Database:
- Plan further tables
    - plan how to schedule trains (when to add new trains?)
    - train timetable
    - trains 
    - Sold tickets


### Backlog:
- RxJS genau anschauen: https://www.youtube.com/watch?v=tGWBy6Vqq9w (13:41)
- dockerize the app
    - https://www.youtube.com/watch?v=IDVUy34vlSE
    - Cors errors, wtf is nginx and how to do db connection???
    - How to have it update during development?
    - deploy with docker?
- using only get and post ok?
- Learn about SSL encryption, so data can be safely transferred through https(!) requests
- Learn about OpenID Connect and other auth frameworks