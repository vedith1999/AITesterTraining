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
@Feature("Negative Login Scenarios")
public class InvalidLoginTest extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod
    public void navigateToLoginPage() {
        driver.get(ConfigReader.get("app.url"));
        loginPage = new LoginPage(driver);
    }

    @Test(priority = 3, description = "TC_003: Error displayed for valid username with incorrect password", groups = {
            "smoke", "regression" })
    @Story("Invalid Login — Wrong Password")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify that submitting a valid email with an incorrect password shows an error message and does not allow access.")
    public void TC_003_ValidEmailInvalidPassword() {
        try {
            loginPage.doLogin(
                    ConfigReader.get("valid.username"),
                    ConfigReader.get("invalid.password"));
            Assert.assertTrue(
                    loginPage.isErrorDisplayed(),
                    "TC_003 FAILED: Error message was not displayed for invalid password.");
            Assert.assertFalse(
                    loginPage.getErrorMessage().isEmpty(),
                    "TC_003 FAILED: Error message text was empty.");
        } catch (AssertionError ae) {
            captureScreenshot();
            throw ae;
        } catch (Exception e) {
            captureScreenshot();
            Assert.fail("TC_003 FAILED due to unexpected exception: " + e.getMessage());
        }
    }

    @Test(priority = 4, description = "TC_004: Error displayed for invalid username with valid password", groups = {
            "smoke", "regression" })
    @Story("Invalid Login — Wrong Username")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify that submitting a non-existent email with a valid password shows an error message and does not allow access.")
    public void TC_004_InvalidEmailValidPassword() {
        try {
            loginPage.doLogin(
                    ConfigReader.get("invalid.username"),
                    ConfigReader.get("valid.password"));
            Assert.assertTrue(
                    loginPage.isErrorDisplayed(),
                    "TC_004 FAILED: Error message was not displayed for invalid username.");
            Assert.assertFalse(
                    loginPage.getErrorMessage().isEmpty(),
                    "TC_004 FAILED: Error message text was empty.");
        } catch (AssertionError ae) {
            captureScreenshot();
            throw ae;
        } catch (Exception e) {
            captureScreenshot();
            Assert.fail("TC_004 FAILED due to unexpected exception: " + e.getMessage());
        }
    }

    @Test(priority = 5, description = "TC_005: Validation message shown when both fields are submitted empty", groups = {
            "regression" })
    @Story("Invalid Login — Empty Credentials")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify that submitting the login form with both username and password fields empty triggers a validation/error message.")
    public void TC_005_EmptyCredentials() {
        try {
            loginPage.doLogin("", "");
            Assert.assertTrue(
                    loginPage.isErrorDisplayed(),
                    "TC_005 FAILED: No validation message was shown for empty credentials.");
        } catch (AssertionError ae) {
            captureScreenshot();
            throw ae;
        } catch (Exception e) {
            captureScreenshot();
            Assert.fail("TC_005 FAILED due to unexpected exception: " + e.getMessage());
        }
    }

    @Test(priority = 6, description = "TC_006: Error displayed for malformed email format", groups = { "regression" })
    @Story("Invalid Login — Malformed Email Format")
    @Severity(SeverityLevel.MINOR)
    @Description("Verify that submitting a syntactically invalid email address shows an appropriate error and prevents login.")
    public void TC_006_MalformedEmailFormat() {
        try {
            loginPage.doLogin(
                    ConfigReader.get("malformed.email"),
                    ConfigReader.get("valid.password"));
            Assert.assertTrue(
                    loginPage.isErrorDisplayed(),
                    "TC_006 FAILED: No error displayed for malformed email format.");
        } catch (AssertionError ae) {
            captureScreenshot();
            throw ae;
        } catch (Exception e) {
            captureScreenshot();
            Assert.fail("TC_006 FAILED due to unexpected exception: " + e.getMessage());
        }
    }
}
