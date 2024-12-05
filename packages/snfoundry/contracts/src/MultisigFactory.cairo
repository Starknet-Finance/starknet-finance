#[starknet::contract]
mod MultisigFactory {
    use contracts::interfaces::IMultisigFactory::{IMultisigFactory, ModuleConfig, MultisigCreated};
    use starknet::syscalls::deploy_syscall;
    use starknet::{ContractAddress};


    #[storage]
    struct Storage {
        multisig_class_hash: felt252,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        MultisigCreated: MultisigCreated
    }

    #[constructor]
    fn constructor(ref self: ContractState, _multisig_classhash: felt252) {
        self.multisig_class_hash.write(_multisig_classhash);
    }

    #[abi(embed_v0)]
    impl MultisigFactoryImpl of IMultisigFactory<ContractState> {
        fn deploy_multisig(
            ref self: ContractState,
            signers: Array<ContractAddress>,
            threshold: u8,
            module: Array<ModuleConfig>,
            salt: felt252
        ) {
            let mut calldata = array![];

            signers.serialize(ref calldata);
            calldata.append(threshold.into());
            module.serialize(ref calldata);

            // Deploy the contract
            deploy_syscall(
                self.multisig_class_hash.read().try_into().unwrap(),
                salt,
                calldata.span(),
                false // Set contract address as non-fixed
            )
                .unwrap();

            self.emit(MultisigCreated { signers: signers, threshold: threshold });
        }
    }
}
