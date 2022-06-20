# The Snake

## App Name: Find the Cause

### Team Overview:
Jacob Rottenberg -- jrott36

### Application Idea:
A single page web application that allows users to search for different charities, and rate them. Ideally, by typing in a phrase related to a cause they can see a list of charities that support the cause and be redirected to one that they click on. There will also ideally be a group subscribe option where a user can enter their email and automatically subscribe to multiple mailing lists instead of having to go to each site and subscribe. The option to donate will also be on the site as well.

### Functionality:
The application provides a search functionality that allows a user to search charities, a rating system where a user can rate a charity that others can see so that they know what the most popular charity for a cause is, and group subscribe list. These will be used with a text search bar and go option to search. The rating system will either be with a like system (no disliking charities because that's not cool.) The ratings will be in a server-side database. The email subscribe list will also pull from a database where the email subscribe pages can be found to enter the data. The charity organizations will be pulled from the Global Giving API where the donation option will be too.

### HTML Structure:
![Alt text](./HTML%20Structure.PNG)
The head includes some Bootstrap lines and links to the css file for styling and a module for the main script. In the body includes the Bootstrap container for formatting, a title and the search block. This block includes the search bar and button for searching. After the search block comes the query where the page will tell you what it searched for. After the query is the results section which is where results for charities will be entered dynamically.