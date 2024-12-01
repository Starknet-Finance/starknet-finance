#[starknet::contract]
mod TimeWindowModule {
    use contracts::interfaces::IModule::{IModule};
    use contracts::interfaces::IMultisigFactory::{ModuleType};
    use starknet::{ContractAddress};
    use starknet::{account::Call};

    #[storage]
    struct Storage {
        start_hour: u8,  
        end_hour: u8   
    }

    #[constructor]
    fn constructor(ref self: ContractState, _start_hour: u8, _end_hour: u8) {
        assert!(_start_hour < 24, "Invalid start hour");
        assert!(_end_hour < 24, "Invalid end hour");
        self.start_hour.write(_start_hour);
        self.end_hour.write(_end_hour);
    }

    #[abi(embed_v0)]
    impl ModuleImpl of IModule<ContractState> {
        fn check_transaction(self: @ContractState, calls: Span<Call>) -> bool {
            let timestamp = starknet::get_block_timestamp();
            let current_hour = (timestamp / 3600) % 24;
            
            current_hour >= self.start_hour.read().into() && 
            current_hour <= self.end_hour.read().into()
        }

        fn get_module_type(self: @ContractState) -> ModuleType {
            ModuleType::TimeWindow
        }
    }
}