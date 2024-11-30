use core::num::traits::WideMul;
use starknet::{TxInfo, SyscallResultTrait};
use starknet::syscalls::call_contract_syscall;
use starknet::account::Call;

pub fn execute_calls(mut calls: Span<Call>) -> Array<Span<felt252>> {
    let mut result = ArrayTrait::new();
    loop {
        match calls.pop_front() {
            Option::Some(call) => {
                let mut res = call_contract_syscall(
                    address: *call.to,
                    entry_point_selector: *call.selector,
                    calldata: *call.calldata
                )
                    .unwrap_syscall();
                result.append(res);
            },
            Option::None => { break; },
        };
    };
    result
}
