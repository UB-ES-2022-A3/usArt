from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


options = Options()
# options.add_argument('--headless')
# options.add_argument('--disable-gpu')  # Last I checked this was necessary.
driver = webdriver.Chrome(chrome_options=options)


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
    driver.find_element(by=By.ID, value='flexCheckDefault').click()
    driver.find_element(by=By.ID, value='register_button').click()


def test_ur10_login():
    driver.get('http://localhost:3000/home')

    log_in_button = driver.find_element(by=By.ID, value='button_login')
    log_in_button.click()

    username = driver.find_element(by=By.ID, value='form2')
    password = driver.find_element(by=By.ID, value='form3')
    sign_in_button = driver.find_element(by=By.ID, value='login_button')

    username.send_keys('Alum')
    password.send_keys('Alum123-')
    sign_in_button.click()


def test_ur4():
    test_ur10_login()

    driver.implicitly_wait(10)
    driver.find_element(by=By.ID, value='explore_button').click()
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[text()="Boyfriends Comic Book Issue 1!"]').click()
    driver.find_element(by=By.ID, value="contact_button").click()

    # contact_button = driver.find_element(by=By.ID, value='contact_button')
    # contact_button.click()


