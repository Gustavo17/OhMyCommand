(function() {
    'use strict';

    angular
        .module('app.commands')
        .controller('CommandsController', CommandsController);

    // 'isLoggedIn' is passed from the config.route.js
    CommandsController.$inject = ['$location', '$localStorage', 'isLoggedIn', 'CommandService', 'UserService'];

    function CommandsController($location, $localStorage, isLoggedIn, CommandService, UserService) {
        var vm = this;

        if (!isLoggedIn) {
            $location.path('/');
            return;
        }

        vm.commands = '';
        vm.username = $localStorage.username;
        vm.deleteCommand = deleteCommand;
        vm.newCommand = newCommand;

        vm.new = {
            command: '',
            os:  '',
            version: '',
            note: ''
        };

        vm.edit = {
            command: '',
            os:  '',
            version: '',
            note: ''
        };

        commands();

        ////////////////////
        function commands() {
            var query = CommandService.query();
            query.$promise
                .then(function(data) {
                    vm.commands = data;
                }).catch(function(error) {
                    console.log(error);
                    vm.commands = error;
                });
        }

        function deleteCommand(command) {
            var i;
            for (i = 0; i < vm.commands.length; i++)
                if(vm.commands[i].id === command.id)
                    break;

            var deleteQuery = CommandService.delete({id: command.id});
            deleteQuery.$promise
                .then(function(data) {
                    vm.commands.splice(i, 1);
                    console.log(data);
                }).catch(function(error) {
                    console.log(error);
                });
        }

        function newCommand() {
            // TODO: Error checking must have at least 'command' filled out
            if (vm.new.command === '')
                return;

            var query = CommandService.save({
                command: vm.new.command,
                os: vm.new.os,
                version: vm.new.version,
                note: vm.new.note,
                user: $localStorage.token
            });

            query.$promise
                .then(function(data) {
                    vm.commands.unshift(data);
                    $('#newCommandModal').modal('hide');
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
})();
