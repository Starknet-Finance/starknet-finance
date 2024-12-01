use starknet::{ContractAddress};


#[derive(Drop, Copy, Serde, starknet::Store, PartialEq)]
pub enum ModuleType {
    Whitelist,
    TimeWindow,
}

#[derive(Drop, Copy, Serde, starknet::Store)]
pub struct ModuleConfig {
    pub module_type: ModuleType,
    pub module_address: ContractAddress,
    pub is_active: bool,
}


#[derive(Drop, starknet::Event)]
pub struct MultisigCreated {
    #[key]
    pub signers: Array<ContractAddress>,
    pub threshold: u8,
}

#[starknet::interface]
pub trait IMultisigFactory<ContractState> {
    /// @notice Deploy a new multisig contract
    /// @param signers The addresses of owners
    /// @param threshold The number of signatures required to execute a transaction
    fn deploy_multisig(
        ref self: ContractState,
        signers: Array<ContractAddress>,
        threshold: u8,
        module: Array<ModuleConfig>,
        salt: felt252
    );
}
