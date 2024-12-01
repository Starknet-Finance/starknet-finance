#[starknet::contract]
mod MultisigFactory {
    use contracts::interfaces::IModule::{IModule};
    use starknet::{ContractAddress};
    use contracts::interfaces::IMultisigFactory::{ModuleType};
    use starknet::storage::{Map, Vec, VecTrait};
    use starknet::{account::Call};
    use starknet::storage::MutableVecTrait;

    #[storage]
    struct Storage {
        whitelisted_address: Vec<ContractAddress>,
        is_whitelisted: Map<ContractAddress, bool>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, _whitelisted_address: Array<ContractAddress>) {
        for whitelisted_address in _whitelisted_address {
            self.is_whitelisted.write(whitelisted_address, true);
            self.whitelisted_address.append().write(whitelisted_address);
        }
    }

    #[abi(embed_v0)]
    impl ModuleImpl of IModule<ContractState> {
        fn check_transaction(self: @ContractState, calls: Span<Call>) -> bool {
            // get all signers
            // check for all call, if the recipient is in whitelist
            // if not, return false
            let mut is_valid = true;

            for call in calls { // check if selector is transfer
                // check if to is in whitelist
                if !self.is_whitelisted.read(*call.to) {
                    is_valid = false;
                    break;
                }
            };
            is_valid
        }

        fn get_module_type(self: @ContractState) -> ModuleType {
            return ModuleType::Whitelist;
        }
    }
}
