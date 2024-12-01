#[starknet::contract]
mod Multisig {
    use starknet::storage::MutableVecTrait;
    use contracts::interfaces::IMultisig::{
        IMultisig, CallMeta, Transaction, TransactionExecuted, TransactionSigned,
        TransactionProposed
    };
    use contracts::interfaces::IMultisigFactory::{ModuleConfig};
    use contracts::interfaces::IModule::{IModuleDispatcher, IModuleDispatcherTrait};
    use contracts::utils::{execute_calls};
    use starknet::{ContractAddress, get_caller_address};
    use starknet::{account::Call};
    use starknet::storage::{
        StoragePathEntry, Map, Vec, StoragePointerReadAccess, StoragePointerWriteAccess, VecTrait,
    };
    use core::poseidon::poseidon_hash_span;

    #[storage]
    struct Storage {
        counter: u256,
        threshold: u8,
        is_signer: Map<ContractAddress, bool>,
        signers: Vec<ContractAddress>,
        transactions: Map<u256, Transaction>,
        transaction_signed: Map<u256, Map<ContractAddress, bool>>,
        modules: Vec<ModuleConfig>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TransactionProposed: TransactionProposed,
        TransactionExecuted: TransactionExecuted,
        TransactionSigned: TransactionSigned
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        signers: Array<ContractAddress>,
        threshold: u8,
        _module: Array<ModuleConfig>
    ) {
        self.threshold.write(threshold);
        for module in _module {
            self.modules.append().write(module);
        };
        for signer in signers {
            self.is_signer.write(signer, true);
            self.signers.append().write(signer);
        }
    }

    // impl IMoaAccountImpl of IMoa<ContractState> {}

    #[abi(embed_v0)]
    impl MultisigImpl of IMultisig<ContractState> {
        fn propose_transaction(ref self: ContractState, calls: Array<Call>) {
            self._before_propose_transaction(calls.span());
            // increment the counter
            let new_counter = self.counter.read() + 1;
            self.counter.write(new_counter);

            let transaction_hash = self._calculate_transaction_hash(calls.clone());

            // insert new pending transaction
            let transaction = Transaction {
                confirmations: 0, executed: false, hash: transaction_hash
            };
            self.transactions.write(new_counter, transaction);

            // emit the event
            self.emit(TransactionProposed { tx_id: new_counter, calls: calls.span() });
        }


        fn sign_transaction(ref self: ContractState, tx_id: u256, calls: Array<Call>) {
            // check if the caller is a signer
            let caller = get_caller_address();
            assert!(self.is_signer.read(caller), "Caller is not a signer");

            let transaction = self.transactions.read(tx_id);

            // transaction hash need to be the same
            let transaction_hash = self._calculate_transaction_hash(calls.clone());
            assert!(transaction.hash == transaction_hash, "Transaction hash mismatch");

            // check if the transaction is pending
            assert!(!transaction.executed, "Transaction already executed");

            // check if the caller has already signed the transaction
            let signed = self.transaction_signed.entry(tx_id).entry(caller).read();
            assert!(!signed, "Caller has already signed the transaction");

            // check current confirmations
            let confirmations = transaction.confirmations.clone();

            // if current sign + confirmations >= threshold, execute the calls
            if confirmations + 1 >= self.threshold.read() {
                let executed_transaction = Transaction {
                    confirmations: confirmations + 1, executed: true, hash: transaction_hash
                };
                self.transactions.write(tx_id, executed_transaction);
                execute_calls(calls.span());
                self.emit(TransactionExecuted { tx_id: tx_id });
            }

            // update the signed map
            self.transaction_signed.entry(tx_id).entry(caller).write(true);

            self.emit(TransactionSigned { tx_id: tx_id, signer: caller });
        }

        fn get_signers(self: @ContractState) -> Array<ContractAddress> {
            let mut addresses = array![];
            for i in 0
                ..self
                    .signers
                    .len() {
                        addresses.append(self.signers.at(i).read());
                    };
            addresses
        }

        fn is_signed(self: @ContractState, signer: ContractAddress, tx_id: u256) -> bool {
            self.transaction_signed.entry(tx_id).entry(signer).read()
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _before_propose_transaction(ref self: ContractState, calls: Span<Call>) {
            // check if the caller is a signer
            let caller = get_caller_address();
            assert!(self.is_signer.read(caller), "Caller is not a signer");
            // check if calls are in supported module

            self._check_modules(calls.clone());
        }

        fn _check_modules(ref self: ContractState, calls: Span<Call>) {
            // Iterate through active modules and check their conditions
            for i in 0
                ..self
                    .modules
                    .len() {
                        let module_config = self.modules.at(i).read();
                        if module_config.is_active {
                            let module_dispatcher = IModuleDispatcher {
                                contract_address: module_config.module_address
                            };
                            // first check if type supported
                            let module_type = module_dispatcher.get_module_type();

                            assert!(
                                module_config.module_type == module_type, "Module type mismatch"
                            );

                            assert!(module_dispatcher.check_transaction(calls), "Module check failed");
                        }
                    }
        }


        fn _calculate_transaction_hash(ref self: ContractState, calls: Array<Call>) -> felt252 {
            let mut all_calldata: Array<felt252> = ArrayTrait::new();
            for call in calls {
                all_calldata.append(call.to.into());
                all_calldata.append(call.selector);
                for item in call.calldata {
                    all_calldata.append(*item);
                };
            };
            let transaction_hash = poseidon_hash_span(all_calldata.span());
            transaction_hash
        }
    }
}

