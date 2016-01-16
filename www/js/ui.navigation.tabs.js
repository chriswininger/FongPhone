(function() {
    FongPhone.Navigation.Tabs = [
        {
            text: 'Fongs',
            location: '#/',
            tabClass: 'fong-phone-button-fong',
            pageClass: 'view-pad'
        },
        {
            text: 'Sound',
            location: '#/sound',
            tabClass: 'fong-phone-button-sound',
            pageClass: 'view-sound'
        },
        {
            text: 'Notes/Loops',
            location: '#/note-map',
            tabClass: 'fong-phone-button-loops',
            pageClass: 'view-map'
        },
        {
            text: 'States',
            location: '#/states',
            tabClass: 'fong-phone-button-states',
            pageClass: 'view-states'
        }
    ];

    FongPhone.Navigation.tabNavigationFunc = function(stateController, loc) {
        setWindow(loc);
        stateController.saveAll();
    };
})();
