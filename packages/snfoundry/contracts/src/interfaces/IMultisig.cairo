use starknet::{ContractAddress};
use starknet::{account::Call};

#[derive(Drop, starknet::Event)]
pub struct TransactionProposed {
    #[key]
    pub tx_id: u256,
    #[key]
    pub calls: Span<Call>,
}

#[derive(Drop, Copy, Serde, starknet::Store)]
pub struct CallMeta {
    pub to: ContractAddress,
    pub selector: felt252,
}

#[derive(Drop, starknet::Event)]
pub struct TransactionSigned {
    #[key]
    pub tx_id: u256,
    #[key]
    pub signer: ContractAddress,
}

#[derive(Drop, starknet::Store)]
pub struct Transaction {
    pub confirmations: u8,
    pub executed: bool,
}

#[derive(Drop, starknet::Event)]
pub struct TransactionExecuted {
    #[key]
    pub tx_id: u256,
}

#[starknet::interface]
pub trait IMultisig<ContractState> {
    fn propose_transaction(ref self: ContractState, calls: Span<Call>);

    fn sign_transaction(ref self: ContractState, tx_id: u256, calls: Span<Call>);
}
