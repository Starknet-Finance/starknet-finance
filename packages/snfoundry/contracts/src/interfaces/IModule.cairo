use starknet::{account::Call};
use contracts::interfaces::IMultisigFactory::{ModuleType};

#[starknet::interface]
pub trait IModule<TContractState> {
    fn check_transaction(self: @TContractState, calls: Span<Call>) -> bool;
    fn get_module_type(self: @TContractState) -> ModuleType;
}
