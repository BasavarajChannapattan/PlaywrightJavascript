Feature: User Authentication test


Background:
  Given User navigates to the application
  And User click on the login link


  Scenario: Login should be successful with valid credentials
    And User enter the username as "ortoni"
    And User enter the password as "Pass1234"
    When User click on the login button
    Then User should be redirected to the home page

    Scenario: Login should fail with invalid credentials
    And User enter the username as "Basava"
    And User enter the password as "Pass12345"
    When User click on the login button
