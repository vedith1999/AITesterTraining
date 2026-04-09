package com.ricepot.tests;

import com.ricepot.base.BaseTest;
import com.ricepot.pages.LoginPage;
import com.ricepot.utils.ConfigReader;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

@Epic("Salesforce CRM — Login Module")
@Feature("Positive Login Scenarios")
public class ValidLoginTest extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod
    public void navigateToLoginPage() {
        driver.manage().deleteAllCookies();
        driver.get(ConfigReader.get("app.url"));
        loginPage = new LoginPage(driver);
    }

    @Test(priority = 1, description = "TC_001: Successful login with valid email and password", groups = { "smoke",
            "regression" })
    @Story("Valid Login")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify that a registered Salesforce user can log in successfully using valid credentials and is redirected away from the login page.")
    public void TC_001_ValidLoginWithCorrectCredentials() {
        try {
            loginPage.doLogin(
                    ConfigReader.get("valid.username"),
                    ConfigReader.get("valid.password"));
            boolean success = loginPage.isLoginSuccessful();
            Assert.assertTrue(
                    success,
                    "TC_001 FAILED: User was not redirected. Current URL: " + driver.getCurrentUrl());
        } catch (AssertionError ae) {
            captureScreenshot();
            throw ae;
        } catch (Exception e) {
            captureScreenshot();
            Assert.fail("TC_001 FAILED due to unexpected exception: " + e.getMessage());
        }
    }

    @Test(priority = 2, description = "TC_002: Login with valid credentials and Remember Me checkbox selected", groups = {
            "regression" })
    @Story("Remember Me Functionality")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify that the Remember Me checkbox can be selected before login, its state is preserved before form submission, and login succeeds.")
    public void TC_002_ValidLoginWithRememberMeChecked() {
        try {
            loginPage.enterUsername(ConfigReader.get("valid.username"));
            loginPage.enterPassword(ConfigReader.get("valid.password"));
            loginPage.checkRememberMe();

            Assert.assertTrue(
                    loginPage.isRememberMeChecked(),
                    "TC_002 FAILED: Remember Me checkbox was not in checked state before form submission.");

            loginPage.clickLogin();

            boolean success = loginPage.isLoginSuccessful();
            Assert.assertTrue(
                    success,
                    "TC_002 FAILED: Login did not succeed. Current URL: " + driver.getCurrentUrl());
        } catch (AssertionError ae) {
            captureScreenshot();
            throw ae;
        } catch (Exception e) {
            captureScreenshot();
            Assert.fail("TC_002 FAILED due to unexpected exception: " + e.getMessage());
        }
    }
}
