use starknet::{ContractAddress};


#[derive(Drop, Copy, Serde, starknet::Store)]
pub enum SupportedModules {
    Whitelist,
    ERC20,
    ERC721
}

#[derive(Drop, starknet::Event)]
pub struct MultisigCreated {
    #[key]
    pub signers: Array<ContractAddress>,
    pub threshold: u8,
    pub module: Array<SupportedModules>,
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
        module: Array<SupportedModules>,
        salt: felt252
    );
}
