from selenium import webdriver
from selenium.webdriver.common.by import By

from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.headless = True
driver = webdriver.Chrome(options=chrome_options)
driver.maximize_window()


def test_u1_ver_catalogo():
    driver.get('http://localhost:3000/home')

    explore_button = driver.find_element(by=By.ID, value='explore_button')
    explore_button.click()

    driver.implicitly_wait(10)

    title = driver.find_element(by=By.ID, value='explore-title').text
    assert title == 'Explore the talent at UsArt'
    driver.implicitly_wait(20)


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
    driver.implicitly_wait(20)


def test_u2_ver_publicacion():
    driver.get('http://localhost:3000/explore')

    driver.find_element(by=By.XPATH, value='//*[contains(text(), "Boyfriends Comic Book Issue 1!")]').click()
    driver.implicitly_wait(10)
    username = driver.find_element(by=By.XPATH, value='//*[contains(text(), "refrainbow")]').text
    profile_button = driver.find_element(by=By.XPATH, value='//*[@id="pub-profile-button"]')

    assert username == 'refrainbow'
    assert profile_button.text == 'Profile'
    driver.implicitly_wait(20)


def test_u4_buscar_producto():
    driver.get('http://localhost:3000/home')

    driver.find_element(by=By.XPATH, value='//*[@id="search-bar"]').send_keys('Alum')
    driver.find_element(by=By.XPATH, value='//*[@id="button-addon1"]').click()
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[contains(text(), "Lookie Uppies Sketchbook")]').click()
    driver.implicitly_wait(10)
    title = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Lookie Uppies Sketchbook")]').text
    username = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Alum")]').text

    assert title == 'Lookie Uppies Sketchbook'
    assert username == 'Alum'
    driver.implicitly_wait(20)


def test_ur17_terms_and_services():
    driver.get('http://localhost:3000/explore')

    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="terms-button"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    title = driver.find_element(by=By.XPATH, value='//*[contains(text(), "UsArt Terms of Use")]').text

    assert title == 'UsArt Terms of Use'
    driver.implicitly_wait(20)


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
    driver.implicitly_wait(20)


def test_ur15_informacion_compra():
    test_ur10_login_alum()

    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="radio3"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    sale = driver.find_element(by=By.XPATH, value='//*[contains(text(), "As soon as I saw her, I knew I was going to end up drawing her.")]')
    driver.execute_script("arguments[0].click();", sale)
    driver.implicitly_wait(10)
    username = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Alum")]').text
    direction = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Josep Serrano, 24 bj1a")]').text

    assert username == 'Username: Alum'
    assert direction == 'Address: Josep Serrano, 24 bj1a'
    driver.implicitly_wait(20)


def test_ur4_comisionar():
    driver.get('http://localhost:3000/home')

    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="explore_button"]').click()

    driver.implicitly_wait(10)
    pub = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Bug Enthusiast Freestyle Commission")]')
    driver.execute_script("arguments[0].click()", pub)
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="action-button"]')
    driver.execute_script("arguments[0].click()", button)
    driver.find_element(by=By.XPATH, value='//*[@id="modal_review"]').send_keys("test")
    driver.find_element(by=By.XPATH, value='//*[@id="send_button"]').click()
    driver.implicitly_wait(20)


def test_ur12_historial_compras():
    driver.get('http://localhost:3000/home')

    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="radio3"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[contains(text(), "As soon as I saw her, I knew I was going to end up drawing her.")]')
    driver.implicitly_wait(20)


def test_ur14_editar_perfil():
    driver.get('http://localhost:3000/home')

    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="editButton"]').click()
    driver.find_element(by=By.XPATH, value='//*[@id="saveBtn"]').click()
    driver.implicitly_wait(20)


def test_ur1_puntuar_artista():
    driver.get('http://localhost:3000/home')

    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="explore_button"]').click()
    pub = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Bug Enthusiast Freestyle Commission")]')
    driver.execute_script("arguments[0].click();", pub)
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="pub-profile-button"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(20)
    

def test_ur7_participar_subasta():
    driver.get('http://localhost:3000/home')

    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="search-bar"]').send_keys('Subasta de prueba')
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="button-addon1"]').click()
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[contains(text(), "Subasta de prueba")]').click()
    driver.implicitly_wait(10)
    bid_button = driver.find_element(by=By.XPATH, value='//*[@id="action-button"]')
    driver.execute_script("arguments[0].click()", bid_button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.ID, value='bidpost').send_keys('9')
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="bidbutton"]').click()
    driver.implicitly_wait(20)


def test_ur2_devolver_pedidos():
    driver.get('http://localhost:3000/home')

    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]').click()
    driver.implicitly_wait(10)
    purchases_button = driver.find_element(by=By.ID, value='radio3')
    driver.execute_script("arguments[0].click()", purchases_button)
    driver.implicitly_wait(10)
    purchase = driver.find_element(by=By.XPATH,
            value='//*[contains(text(), "As soon as I saw her, I knew I was going to end up drawing her.")]')
    driver.execute_script("arguments[0].click()", purchase)
    driver.implicitly_wait(10)
    refund_button = driver.find_element(by=By.XPATH, value='//*[@id="button-refund"]')
    driver.execute_script("arguments[0].click()", refund_button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="button-cancel-refund"]').click()
    driver.implicitly_wait(10)
    purchases_button = driver.find_element(by=By.ID, value='radio3')
    driver.execute_script("arguments[0].click()", purchases_button)
    driver.implicitly_wait(10)
    purchase = driver.find_element(by=By.XPATH,
            value='//*[contains(text(), "As soon as I saw her, I knew I was going to end up drawing her.")]')
    driver.execute_script("arguments[0].click()", purchase)
    driver.implicitly_wait(10)
    refund_button = driver.find_element(by=By.XPATH, value='//*[@id="button-refund"]')
    driver.execute_script("arguments[0].click()", refund_button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.ID, value='modal_reason').send_keys('Because I want')
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="button-send-refund"]').click()
    driver.implicitly_wait(20)


def test_ur8_denunciar_servicio():
    driver.get('http://localhost:3000/home')

    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="search-bar"]').send_keys('a')
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="button-addon1"]').click()
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[contains(text(), "Boyfriends Comic Book Issue 1!")]').click()
    driver.implicitly_wait(10)
    complaint_button = driver.find_element(by=By.XPATH, value='//*[@id="button-complaint"]')
    driver.execute_script("arguments[0].click()", complaint_button)
    driver.implicitly_wait(10)
    close = driver.find_element(by=By.XPATH, value='//*[@id="close_button"]')
    driver.execute_script("arguments[0].click()", close)
    driver.implicitly_wait(10)
    complaint_button = driver.find_element(by=By.XPATH, value='//*[@id="button-complaint"]')
    driver.execute_script("arguments[0].click()", complaint_button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.ID, value='reason').send_keys('Because I want')
    driver.implicitly_wait(10)
    compl = driver.find_element(by=By.XPATH, value='//*[@id="send_button"]')
    driver.execute_script("arguments[0].click()", compl)
    driver.implicitly_wait(20)


def test_ur11_logout():
    driver.implicitly_wait(10)

    out = driver.find_element(by=By.ID, value='logout_button')
    driver.execute_script("arguments[0].click()", out)
    driver.implicitly_wait(20)


def test_a2_banear_usuario():
    driver.get('http://localhost:3000/home')
    driver.implicitly_wait(10)
    log_in_button = driver.find_element(by=By.XPATH, value='//*[@id="button_login"]')
    log_in_button.click()
    username = driver.find_element(by=By.ID, value='form2')
    password = driver.find_element(by=By.ID, value='form3')
    sign_in_button = driver.find_element(by=By.XPATH, value='//*[@id="login_button"]')
    username.send_keys('admin')
    password.send_keys('admin')
    sign_in_button.click()

    driver.find_element(by=By.XPATH, value='//*[@id="search-bar"]').send_keys('Alum')
    driver.find_element(by=By.XPATH, value='//*[@id="button-addon1"]').click()
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="SelectUsers"]').click()
    driver.implicitly_wait(10)

    driver.get('http://localhost:3000/profile/Alum/default')
    driver.implicitly_wait(10)
    ban_button = driver.find_element(by=By.XPATH, value='//*[@id="banuser"]')
    driver.execute_script("arguments[0].click()", ban_button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="confirm_ban"]').click()
    driver.implicitly_wait(10)

    username = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Alum")]').text
    assert username == 'Alum'
    driver.implicitly_wait(20)
