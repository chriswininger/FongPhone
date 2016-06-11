(function() {
    FongPhone.Navigation.Tabs = [
        {
            text: 'Fong 1',
            location: '#',
            selection: 0,
            tabClass: 'fong-phone-button-fong',
            pageClass: 'view-pad',
            selected: true
        },
        {
            text: 'Fong 2',
            location: '#',
            selection: 1,
            tabClass: 'fong-phone-button-fong',
            pageClass: 'view-sound',
            selected: false
        },
        {
            text: 'Fong 3',
            location: '#',
            selection: 2,
            tabClass: 'fong-phone-button-fong',
            pageClass: 'view-map',
            selected: false
        },
        {
            text: 'Fong 4',
            location: '#',
            selection: 3,
            tabClass: 'fong-phone-button-fong',
            pageClass: 'view-states',
            selected: false
        }
    ];

    FongPhone.Navigation.tabNavigationFunc = function(stateController, tab, scope) {
        scope.setSelectedFongID(tab.selection);
        for (var i = 0; i < FongPhone.Navigation.Tabs.length; i++) {
            FongPhone.Navigation.Tabs[i].selected = false;
        }

        tab.selected = true;
        scope.updateKnobs();
    };
})();
