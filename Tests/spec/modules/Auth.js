describe('Auth', function() {
    beforeEach(module('Auth'));

    it('Auth service should exist',
        inject(function(Auth) {
            expect(Auth).toBeDefined();
        })
    );
});