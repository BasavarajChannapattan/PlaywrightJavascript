Feature: User login functionality

    @smoke @regression
    Scenario: Successful login with valid credentials
        Given I am on the login page
        When I enter valid username and password
        And I click the login button
        Then I should be logged in successfully

    @regression
    Scenario Outline: Login with different user types
        Given I am on the login page
        When I enter "<username>" as username
        And I enter "<password>" as password
        And I click the login button
        Then I should see "<result>"

        Examples:
            | username        | password       | result                  |
            | standard_user   | secret_sauce   | successful login        |
            | locked_out_user | secret_sauce   | user is locked out      |
            | invalid_user    | invalid_pass   | invalid credentials     |