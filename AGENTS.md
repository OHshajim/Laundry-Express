***Must be Follow***
1. Does this need to exist?   → no: skip it (YAGNI)
2. Already in this codebase?  → reuse it, don't rewrite
3. Stdlib does it?            → use it
4. Native platform feature?   → use it
5. Installed dependency?      → use it
6. One line?                  → one line
7. Only then: the minimum that works

# Need : 
1. Login and signu and google sign in and logout , passowrd forget and password chnage 
2. Home page where a hero section , order lifecycle, work process , review ,faq, cta banner
3. plan page 
  a. By bag - per bag weight will be 13 gallon 
  b. by the kg 
  c. packges made by admin
4. Order creation page step by step 
  a. select plan 
  b. Select Pickup Date (use calender) and time (8 am - 12 pm and 1pm to 6pm) delevary will in 24 hours  Drop-off date (optional) (Leave blank and we deliver back within 24 hours).
  c. Pickup & Delivery Address (Street number & name ,Apt / unit (optional),City,  State, zip code ) 
  d. select quantity and Wash Detergent (multiple option for chosse) & Temperature acording to this show live total price and total weight
e. take speacial request (optional)
    ```   Will you be home during the pickup window?
        Yes, I will be Home
        Driver rings bell upon arrival
        No, I will be Away
        Contactless doorstep pickup
        Required Doorstep Confirmation:
        I confirm that my laundry bag(s) are placed securely outside my front door / porch for pickup.```
  f. review and select payment method 
  g. after payment confirm show order confirmation page and order status and generate a invoice (Order ID, Order Date, Pickup Date, Delivery Date, Payment Method, Total Amount, Order Details)
5. user dashboard
  a. Show overview 
  b. Order tracking page (Order status , Order history , Order details )
  c. payment history
  d. reviews (can give review with 3 image and rating 1 to 5 star only for completed orders)
  e. settings 
    1. user profile (name, email, phone number, profile picture )
    2. address (add, edit, delete)
    3. password (reset password by verify otp in email and phone number)
    4. notifications (push, email)
6. admin dashboard 
  a. overview 
  b. orders 
  c. customers with details 
  d. Plans management for package  (add, edit, delete) 
    1. title 
    2. description 
    3. key points 
    4. price 
  e. Pricing management (add, edit, delete) 
    1. price for per kg (minimum and maximum)
    3. price for per bag (with minimum and maximum)
  f. Detergent Catalog , Temperature Catalog (add, edit, delete) 
    1. name 
    2. type (for detergent) (liquid, powder), (for temperature) (cold, warm, hot)
    3. brand (for detargent)
    4. price
    5. description 
  g. Coupon & Offer Manager Create, edit, toggle active status, or delete coupon codes.
  H. Customer Review Moderation Manage feedback status, audit 3-photo laundry uploads, or delete spam submissions.
  I. Transaction History View complete payment logs for all customers.
  k. FAQs and Terms & Guarantees Manager (add, edit, delete)
    1. title 
    2. subtitle for (terms)
    2. description (markdown for bold , italic and text size)
  m. Settings (Business hours, delivery zones, minimum order values)



# rules : 
 1. Must be responsive in every screen 
 2. text not braking or overlaping 
 3. less icons uses and let text repeated 
 4. less use of repeated text and context
 5. SEO and LLM Must be Implemented  professionally hilevel requements
 6. Must be Production Ready Code . no bolgary , no extra comments , no chatty reponse must be profassional 
 7. Do not over-engineer the solution 
 8. Must be scalable and maintainable 
 9. Must be secure 
 10. Must be performant 
 11. Must be easy to understand
 12. Must be easy to modify
 13. Must be test and debug after a change
 14. less static data and remove all juncks after code 
 15. delete all unused libraries and functions 
 16. use reusable component is the fast priority ***
 17. If i remove a component don't add this again and keep the website simple don't need add too much content and text or component 
 18. Write code per file maximun 250 lines and stucture maintain must be clean and readable 
 19. no duplicate code



  

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
