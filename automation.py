from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configure the email transporter
def send_email(subject, text, recipient_email, server):
    sender_email = "alijone754rats@gmail.com"
    sender_password = "eqey mexg bmlp kjhl"  # Consider a more secure way to store this

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject

    message.attach(MIMEText(text, "plain"))

    try:
        server.sendmail(sender_email, recipient_email, message.as_string())
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {e}")

# Function to automate login
def automate_login(username, password, recipient_email, server):
    chrome_options = Options()
    # Configure WebDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)

    try:
        driver.get("https://merlinswood.flowhcm.com/#/signin")

        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))
        driver.find_element(By.ID, "username").send_keys(username)
        driver.find_element(By.ID, "password").send_keys(password)
        driver.find_element(By.CLASS_NAME, "sign-in-btn1").click()

        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "btn-SignOut")))
        WebDriverWait(driver, 10).until(lambda d: len(d.find_elements(By.CLASS_NAME, "modal-backdrop")) == 0 or "display: none" in d.find_element(By.CLASS_NAME, "modal-backdrop").get_attribute("style"))
        driver.find_element(By.CLASS_NAME, "btn-SignOut").click()

        send_email("Login Successful", "Your login was successful for account: " + username, recipient_email, server)

    except Exception as e:
        send_email("Login Error", "An error occurred during login for account: " + username + ". Error: " + str(e), recipient_email, server)
    finally:
        driver.quit()

# Credentials list
credentials = [
    {"username": "ali.jone@deltabluecarbon.com", "password": "Ali123", "email": "a.jone.23031@khi.iba.edu.pk"},
    # ... other credentials
]

# Run script for multiple accounts
def run_script_for_multiple_accounts():
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login("alijone754rats@gmail.com", "eqey mexg bmlp kjhl")  # Use the secure method for password

    for credential in credentials:
        automate_login(credential["username"], credential["password"], credential["email"], server)

    server.quit()

run_script_for_multiple_accounts()
