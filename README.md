**Reflection**

**1. Where AI saved time:**

It helped me generate an HTML structure with IDs related to the project requirements.
It also helped me generate CSS styles. However, it is necessary to check that the CSS selectors match the HTML IDs, because I had to make changes when I found that they had different names.
For the JavaScript files, AI also helped me generate code for the functionality requested in the requirements.
AI helped me quickly identify the font-loading issue and guided me through the process of fixing the 404 errors that appeared in the browser console.

**2. AI bug identified and fixed:**
The application was trying to load Inter font files that returned 404 errors. I changed the font-family declaration in styles.css to use "Segoe UI", Arial, sans-serif, and the errors stopped appearing.

**3. Code snippet refactored for clarity:** 
I simplified the font-family declaration by removing the unavailable Inter font.
font-family: "Segoe UI", Arial, sans-serif;

**4. Accessibility improvement added:**
The application uses descriptive button text and the aria-pressed attribute on the flashcard flip button. This communicates whether a card is flipped and helps improve interaction with assistive technologies.

What prompt changes improved AI output: Providing more specific instructions and sharing approximate error messages in some cases and exact browser console errors in others helped AI provide more targeted, step-by-step guidance rather than general suggestions. This made it easier to meet the project requirements.

**In conclusion:** 
AI can save a significant amount of development time. However, as a developer, it is important to understand the suggestions AI provides and use critical thinking to determine which ones are useful for meeting project requirements. Otherwise, AI may generate unnecessary or poor-quality code that does not contribute to the project.