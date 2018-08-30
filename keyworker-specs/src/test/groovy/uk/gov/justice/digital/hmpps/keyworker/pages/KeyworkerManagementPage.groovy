package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.modules.HeaderModule

class KeyworkerManagementPage extends Page {

    static url = "/"

    static at = {
        headingText == 'Manage Key workers'
        manualAssignLink.displayed
        keyworkerProfileLink.displayed
    }

    static content = {
        headingText { $('h1').text() }
        header(required: false) { module(HeaderModule) }
        autoAllocateLink(required: false, to: UnallocatedPage) { $('#auto_allocate_link') }
        enableNewNomisLink(required: false, to: EnableNewNomisPage) { $('#enable_new_nomis_link') }
        manualAssignLink(to: SearchForOffenderPage) { $('#assign_transfer_link') }
        keyworkerProfileLink(to: SearchForKeyworkerPage) { $('#keyworker_profile_link') }
        messageBar(required: false) { $('div #messageBar')}
    }
}
