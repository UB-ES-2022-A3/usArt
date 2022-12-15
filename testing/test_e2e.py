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
    assert title == 'Explore el talento en UsArt'


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


def test_u2_ver_publicacion():
    driver.get('http://localhost:3000/explore')

    driver.find_element(by=By.XPATH, value='//*[contains(text(), "Boyfriends Comic Book Issue 1!")]').click()
    driver.implicitly_wait(10)
    username = driver.find_element(by=By.XPATH, value='//*[contains(text(), "refrainbow")]').text
    profile_button = driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]')

    assert username == 'refrainbow'
    assert profile_button.text == 'Profile'


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


def test_ur15_informacion_compra():
    test_ur10_login_alum()

    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]').click()
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="radio3"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    sale = driver.find_element(by=By.XPATH, value='//*[contains(text(), "As soon as I saw her, I knew I was going to end up drawing her.")]')
    driver.execute_script("arguments[0].click();", sale)
    driver.implicitly_wait(10)
    username = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Alum")]').text
    direction = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Muntaner 214")]').text

    assert username == 'Nombre de usuario: Alum'
    assert direction == 'Dirección: Muntaner 214'


def test_ar9_aceptar_denegar_comision():
    pass


def test_ur17_terms_and_services():
    driver.get('http://localhost:3000/explore')

    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="terms-button"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    title = driver.find_element(by=By.XPATH, value='//*[contains(text(), "UsArt Terms of Use")]').text

    assert title == 'UsArt Terms of Use'


def test_ur11_logout():
    driver.implicitly_wait(10)

    driver.find_element(by=By.ID, value='logout_button').click()


def test_ur4_comisionar():
    test_ur10_login_alum()

    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="explore_button"]')

    driver.get('http://localhost:3000/explore')
    driver.implicitly_wait(10)
    pub = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Bug Enthusiast Freestyle Commission")]')
    driver.execute_script("arguments[0].click()", pub)
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="action-button"]')
    driver.execute_script("arguments[0].click()", button)
    driver.find_element(by=By.XPATH, value='//*[@id="modal_review"]').send_keys("test")
    driver.find_element(by=By.XPATH, value='//*[@id="send_button"]').click()


def test_ur12_historial_compras():
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]').click()
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="radio3"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[contains(text(), "As soon as I saw her, I knew I was going to end up drawing her.")]')


def test_ur14_editar_perfil():
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="editButton"]').click()
    driver.find_element(by=By.XPATH, value='//*[@id="saveBtn"]').click()


def test_ur1_puntuar_artista():
    test_ur10_login_alum()
    driver.implicitly_wait(10)
    driver.find_element(by=By.XPATH, value='//*[@id="explore_button"]')

    driver.get('http://localhost:3000/explore')
    pub = driver.find_element(by=By.XPATH, value='//*[contains(text(), "Bug Enthusiast Freestyle Commission")]')
    driver.execute_script("arguments[0].click();", pub)
    driver.implicitly_wait(10)
    button = driver.find_element(by=By.XPATH, value='//*[@id="profile-button"]')
    driver.execute_script("arguments[0].click();", button)
    driver.implicitly_wait(10)


def test_ur3_perfil():
    pass


def test_ur13_visualizar_chat():
    pass


def test_ur9_comprar_art():
    pass


def test_ar2_crear_publicacion():
    pass


def test_ur5_favoritos_publicacion():
    pass


def test_ur7_participar_subasta():
    pass


def test_ur2_devolver_pedidos():
    pass


def test_ar5_eliminar_publicacion():
    pass


def test_a2_banear_usuario():
    pass


def test_ar7_eliminar_conversacion():
    pass


def test_a1_eliminar_post_admin():
    pass


def test_ar6_bloquear_usuario():
    pass


def test_ur8_denunciar_servicio():
    pass


def test_ar4_modificar_publicacion():
    pass
