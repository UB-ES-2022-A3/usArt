from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager, ChromeType

from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--headless')
driver = webdriver.Chrome(chrome_options=chrome_options)


def test_u3_register_user():
    driver.get('http://localhost:3000/home')

    join_button = driver.find_element(by=By.ID, value='button_join')
    join_button.click()
    title = driver.find_element(by=By.ID, value='title_signup')
    assert title.text == 'Sign up.'

    driver.find_element(by=By.ID, value='form1').send_keys('test')
    driver.find_element(by=By.ID, value='form2').send_keys('test@test.com')
    driver.find_element(by=By.ID, value='form3').send_keys('test')
    driver.find_element(by=By.ID, value='form4').send_keys('test')
    driver.find_element(by=By.XPATH, value='//*[@id="flexCheckDefault"]').click()
    register_button = driver.find_element(by=By.ID, value='register_button')
    driver.execute_script("arguments[0].click()", register_button)


def test_ur10_login_alum():
    driver.get('http://localhost:3000/home')

    driver.implicitly_wait(10)

    log_in_button = driver.find_element(by=By.XPATH, value='//*[@id="button_login"]')
    log_in_button.click()

    username = driver.find_element(by=By.ID, value='form2')
    password = driver.find_element(by=By.ID, value='form3')
    sign_in_button = driver.find_element(by=By.XPATH, value='//*[@id="login_button"]')

    username.send_keys('Alum')
    password.send_keys('Alum123-')
    sign_in_button.click()


def test_ur10_logout():
    test_ur10_login_alum()
    driver.implicitly_wait(10)

    driver.find_element(by=By.ID, value='logout_button').click()







