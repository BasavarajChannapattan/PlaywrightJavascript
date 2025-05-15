Feature: product test


Background:
  Given User navigates to the application
   And User click on the login link

  Scenario Outline: Add to cart
    And User enter the username as "<username>"
    And User enter the password as "<password>"
    And User search for a "<book>"
    When User add the book to the cart
    Then User should see the book in the cart

Examples:
    | username | password  | book          |
    | ortoni   | pass1234$ | harry potter and the chamber of secrets |
    | ortonikc | pass1234  | slayer     |
