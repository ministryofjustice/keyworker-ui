package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class AddRolePage extends Page {


    static url = "/addRole"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Add staff role')
    }

    static content = {
        headingText { $('h1').text() }
        backLink { $('a.backlink')}
        addButton { $('#add-button')}
        messageBar(required: false) { $('div #messageBar')}
        roleOptionUSER_ADMIN { $('#USER_ADMIN_option')}
    }

}