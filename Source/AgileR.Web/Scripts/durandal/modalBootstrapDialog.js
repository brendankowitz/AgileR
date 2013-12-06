﻿define(['composition', 'system', 'viewModel'],
    function (composition, system, viewModel) {

        var contexts = {},
            modalCount = 0;

        function ensureModalInstance(objOrModuleId) {
            return system.defer(function (dfd) {
                if (typeof objOrModuleId == "string") {
                    system.acquire(objOrModuleId).then(function (module) {
                        if (typeof (module) == 'function') {
                            dfd.resolve(new module());
                        } else {
                            dfd.resolve(module);
                        }
                    });
                } else {
                    dfd.resolve(objOrModuleId);
                }
            }).promise();
        }

        var modalDialog = {
            currentZIndex: 1050,
            getNextZIndex: function () {
                return ++this.currentZIndex;
            },
            isModalOpen: function () {
                return modalCount > 0;
            },
            getContext: function (name) {
                return contexts[name || 'default'];
            },
            addContext: function (name, modalContext) {
                modalContext.name = name;
                contexts[name] = modalContext;

                var helperName = 'show' + name.substr(0, 1).toUpperCase() + name.substr(1);
                this[helperName] = function (obj, activationData) {
                    return this.show(obj, activationData, name);
                };
            },
            createCompositionSettings: function (obj, modalContext) {
                var settings = {
                    model: obj,
                    activate: false
                };

                if (modalContext.afterCompose) {
                    settings.afterCompose = modalContext.afterCompose;
                }

                return settings;
            },
            show: function (obj, activationData, context) {
                var that = this;
                var modalContext = contexts[context || 'default'];

                return system.defer(function (dfd) {
                    ensureModalInstance(obj).then(function (instance) {
                        var activator = viewModel.activator();

                        activator.activateItem(instance, activationData).then(function (success) {
                            if (success) {
                                var modal = instance.modal = {
                                    owner: instance,
                                    context: modalContext,
                                    activator: activator,
                                    close: function () {
                                        var args = arguments;
                                        activator.deactivateItem(instance, true).then(function (closeSuccess) {
                                            if (closeSuccess) {
                                                modalCount--;
                                                modalContext.removeHost(modal);
                                                delete instance.modal;
                                                dfd.resolve.apply(dfd, args);
                                            }
                                        });
                                    }
                                };

                                modal.settings = that.createCompositionSettings(instance, modalContext);
                                modalContext.addHost(modal);

                                modalCount++;
                                composition.compose(modal.host, modal.settings);
                            } else {
                                dfd.resolve(false);
                            }
                        });
                    });
                }).promise();
            }
        };

        modalDialog.addContext('default', {
            removeDelay: 200,
            addHost: function (modal) {
                var body = $('body');
                var host = $('<div class="bootstrapModalHost"></div>')
                    .css({ 'z-index': modalDialog.getNextZIndex() })
                    .appendTo(body);

                modal.host = host.get(0);
            },
            removeHost: function (modal) {
                setTimeout(function () {
                    $(modal.host).remove();
                    $(modal.blockout).remove();
                }, this.removeDelay);
            },
            afterCompose: function (parent, newChild, settings) {
                var window = $(newChild).modal({ show: true });
                window.modal("show");
                window.on('hidden', function() {
                    settings.model.modal.close();
                });
            }
        });

        return modalDialog;
    });