package com.ricepot.listeners;

import com.ricepot.base.BaseTest;
import io.qameta.allure.Allure;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.ITestListener;
import org.testng.ITestResult;

import java.io.ByteArrayInputStream;

public class TestListener implements ITestListener {

    @Override
    public void onTestFailure(ITestResult result) {
        Object testInstance = result.getInstance();
        if (testInstance instanceof BaseTest) {
            WebDriver driver = ((BaseTest) testInstance).getDriver();
            if (driver != null) {
                try {
                    byte[] screenshot = ((TakesScreenshot) driver)
                            .getScreenshotAs(OutputType.BYTES);
                    Allure.addAttachment(
                            "Failure Screenshot — " + result.getName(),
                            "image/png",
                            new ByteArrayInputStream(screenshot),
                            "png");
                } catch (Exception e) {
                    Allure.addAttachment(
                            "Screenshot Error",
                            "text/plain",
                            new ByteArrayInputStream(
                                    ("Could not capture screenshot: " + e.getMessage()).getBytes()),
                            "txt");
                }
            }
        }
    }

    @Override
    public void onTestStart(ITestResult result) {
        Allure.addAttachment(
                "Test Started",
                "text/plain",
                new ByteArrayInputStream(
                        ("Executing: " + result.getName()).getBytes()),
                "txt");
    }
}
