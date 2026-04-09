package com.ricepot.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameField;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordField;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorContainer;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        PageFactory.initElements(driver, this);
    }

    @Step("Enter username: {username}")
    public LoginPage enterUsername(String username) {
        wait.until(ExpectedConditions.visibilityOf(usernameField));
        usernameField.clear();
        usernameField.sendKeys(username);
        return this;
    }

    @Step("Enter password")
    public LoginPage enterPassword(String password) {
        wait.until(ExpectedConditions.visibilityOf(passwordField));
        passwordField.clear();
        passwordField.sendKeys(password);
        return this;
    }

    @Step("Click Login button")
    public void clickLogin() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        loginButton.click();
    }

    @Step("Check Remember Me checkbox")
    public LoginPage checkRememberMe() {
        wait.until(ExpectedConditions.elementToBeClickable(rememberMeCheckbox));
        if (!rememberMeCheckbox.isSelected()) {
            rememberMeCheckbox.click();
        }
        return this;
    }

    @Step("Verify Remember Me checkbox is selected")
    public boolean isRememberMeChecked() {
        wait.until(ExpectedConditions.visibilityOf(rememberMeCheckbox));
        return rememberMeCheckbox.isSelected();
    }

    @Step("Retrieve error message text from error container")
    public String getErrorMessage() {
        wait.until(ExpectedConditions.visibilityOf(errorContainer));
        return errorContainer.getText().trim();
    }

    @Step("Verify error container is visible on page")
    public boolean isErrorDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOf(errorContainer));
            return errorContainer.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    @Step("Verify successful login by confirming redirection to Salesforce org domain")
    public boolean isLoginSuccessful() {
        try {
            WebDriverWait redirectWait = new WebDriverWait(driver, Duration.ofSeconds(40));
            redirectWait.until(ExpectedConditions.or(
                    ExpectedConditions.urlContains(".my.salesforce.com"),
                    ExpectedConditions.urlContains("trailblaze.my.salesforce.com"),
                    ExpectedConditions.urlContains("lightning"),
                    ExpectedConditions.urlContains("verification")));
            String currentUrl = driver.getCurrentUrl();
            return currentUrl.contains(".salesforce.com")
                    && !currentUrl.contains("login.salesforce.com");
        } catch (Exception e) {
            return false;
        }
    }

    @Step("Perform login with username: {username}")
    public void doLogin(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    @Step("Perform login with Remember Me enabled for username: {username}")
    public void doLoginWithRememberMe(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        checkRememberMe();
        clickLogin();
    }
}
