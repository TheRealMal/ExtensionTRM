window.onload = () => {
    let checkoutButton = document.querySelector('#checkout-button')
    if (checkoutButton.disabled){
        window.location.reload()
    }
    else {
        document.querySelector('.payment-info > button').click()
        document.querySelectorAll('.pay-type')[2].click()
        document.querySelectorAll('.sub-pay-method > div')[1].click()
        document.querySelector('.save > button').click()
        checkoutButton.click()
    }
};
    