describe('Country', function() {
    beforeEach(module('Country'));

    it('GetAllCountries service should exist',
        inject(function(GetAllCountries) {
            expect(GetAllCountries).toBeDefined();
        })
    );
});