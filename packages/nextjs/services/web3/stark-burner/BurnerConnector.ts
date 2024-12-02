import {
  InjectedConnector,
  UserRejectedRequestError,
  starknetChainId,
} from "@starknet-react/core";
import {
  Account,
  AccountInterface,
  Call,
  CallData,
  RpcProvider,
  byteArray,
  uint256,
} from "starknet";
import {
  ConnectorData,
  ConnectorIcons,
} from "@starknet-react/core/src/connectors/base";
import { Chain, devnet } from "@starknet-react/chains";
import scaffoldConfig from "~~/scaffold.config";
import { BurnerAccount, burnerAccounts } from "~~/utils/devnetAccounts";
import {
  RequestFnCall,
  RpcMessage,
  RpcTypeToMessageMap,
} from "@starknet-io/types-js";

export const burnerWalletId = "burner-wallet";
export const burnerWalletName = "Starknet finance";
const burnerWalletIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYyIiBoZWlnaHQ9IjM2MiIgdmlld0JveD0iMCAwIDM2MiAzNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjE3OS44OTciIGN5PSIxODAuMDE1IiByPSIxNC43ODg5IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjk1XzMwNjgpIi8+CjxwYXRoIGQ9Ik0xNzYuMzU3IDMzNi41NjdDMTc2LjM2NSAzMzcuMzc4IDE3Ni4zNTUgMzM4LjE2NCAxNzYuMzI4IDMzOC45MjFDMTc2LjMyOCAzMzguMTI3IDE3Ni4zMzggMzM3LjM0MiAxNzYuMzU3IDMzNi41NjdDMTc2LjE2NyAzMTYuOTkyIDE2NS4zNzMgMjgyLjgxIDEyMy42NDYgMjc5LjA0NUMxMjAuNjExIDI3OS4xNDYgMTE3Ljc3MiAyNzkuMDEyIDExNS4yNDcgMjc4LjcwN0MxMTguMTc3IDI3OC42ODcgMTIwLjk3NSAyNzguODA0IDEyMy42NDYgMjc5LjA0NUMxNDUuMDgyIDI3OC4zMjggMTc2LjMyOCAyNjUuODUxIDE3Ni4zMjggMjE4LjQ5NEMxNzYuNDY5IDIzOC4xMTIgMTg4LjE3MSAyNzYuOTA4IDIzMy4zNjEgMjc4LjY0N0MyMzQuNDY3IDI3OC42MzUgMjM1LjUzIDI3OC42NTYgMjM2LjU0MiAyNzguNzA3QzIzNS40NjMgMjc4LjcwNyAyMzQuNDAzIDI3OC42ODcgMjMzLjM2MSAyNzguNjQ3QzIxMi44NyAyNzguODY2IDE3Ny41MjEgMjkwLjQ4MSAxNzYuMzU3IDMzNi41NjdaIiBmaWxsPSIjRDU2QUZGIi8+CjxwYXRoIGQ9Ik0xNzYuMzI4IDMzOC45MjFDMTc3LjA1IDMxOC43MDUgMTY1Ljg0NCAyNzguMzYxIDExNS4yNDcgMjc4LjcwN0MxMzUuNjA3IDI4MS4xNjIgMTc2LjMyOCAyNzIuNTU2IDE3Ni4zMjggMjE4LjQ5NEMxNzYuNDcyIDIzOC41NjUgMTg4LjcxNyAyNzguNzA3IDIzNi41NDIgMjc4LjcwN0MyMTYuNDcgMjc3LjY5NyAxNzYuMzI4IDI4OC4zMjQgMTc2LjMyOCAzMzguOTIxWiIgc3Ryb2tlPSIjRDU2QUZGIiBzdHJva2Utd2lkdGg9IjI4Ljg1NDMiIHN0cm9rZS1taXRlcmxpbWl0PSIzLjk5MzkzIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xODUuMzkxIDI1LjE5NTFDMTg1LjM4NCAyNC4zODQzIDE4NS4zOTQgMjMuNTk4NiAxODUuNDIxIDIyLjg0MTFDMTg1LjQyMSAyMy42MzU2IDE4NS40MTEgMjQuNDIwMiAxODUuMzkxIDI1LjE5NTFDMTg1LjU4MiA0NC43NzAxIDE5Ni4zNzUgNzguOTUyNSAyMzguMTAzIDgyLjcxNzVDMjQxLjEzOCA4Mi42MTYxIDI0My45NzYgODIuNzUwNCAyNDYuNTAxIDgzLjA1NDhDMjQzLjU3MSA4My4wNzQ5IDI0MC43NzQgODIuOTU4NSAyMzguMTAzIDgyLjcxNzVDMjE2LjY2NyA4My40MzQxIDE4NS40MjEgOTUuOTExMyAxODUuNDIxIDE0My4yNjlDMTg1LjI4IDEyMy42NSAxNzMuNTc3IDg0Ljg1NDUgMTI4LjM4NyA4My4xMTUzQzEyNy4yODEgODMuMTI3MiAxMjYuMjE5IDgzLjEwNTggMTI1LjIwNyA4My4wNTQ4QzEyNi4yODUgODMuMDU0OCAxMjcuMzQ1IDgzLjA3NTIgMTI4LjM4NyA4My4xMTUzQzE0OC44NzkgODIuODk2NCAxODQuMjI4IDcxLjI4MTUgMTg1LjM5MSAyNS4xOTUxWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE4NS40MjEgMjIuODQxMUMxODQuNjk5IDQzLjA1NjcgMTk1LjkwNCA4My40MDE0IDI0Ni41MDEgODMuMDU0OEMyMjYuMTQxIDgwLjYwMDEgMTg1LjQyMSA4OS4yMDYyIDE4NS40MjEgMTQzLjI2OUMxODUuMjc2IDEyMy4xOTcgMTczLjAzMSA4My4wNTQ4IDEyNS4yMDcgODMuMDU0OEMxNDUuMjc4IDg0LjA2NTYgMTg1LjQyMSA3My40MzggMTg1LjQyMSAyMi44NDExWiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyOC44NTQzIiBzdHJva2UtbWl0ZXJsaW1pdD0iMy45OTM5MyIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjM2LjUzMSAyNzguMzc1QzI3My4wNSAyNzUuNzAzIDMyNi4zOTMgMjQ0LjI0NCAyMzIuODM4IDE2Ni45NTgiIHN0cm9rZT0idXJsKCNwYWludDFfbGluZWFyXzI5NV8zMDY4KSIgc3Ryb2tlLXdpZHRoPSIyOC44NTQzIi8+CjxwYXRoIGQ9Ik0xMjUuMjE4IDgzLjM4NjdDODguNjk4NCA4Ni4wNTg5IDM1LjM1NTEgMTE3LjUxOCAxMjguOTExIDE5NC44MDQiIHN0cm9rZT0idXJsKCNwYWludDJfbGluZWFyXzI5NV8zMDY4KSIgc3Ryb2tlLXdpZHRoPSIyOC44NTQzIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjk1XzMwNjgiIHgxPSIxNjUuMTA4IiB5MT0iMTgwLjAxNSIgeDI9IjE5NC42ODYiIHkyPSIxODAuMDE1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNERDhFRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfMjk1XzMwNjgiIHgxPSIyMzIuODM4IiB5MT0iMTY2Ljk1OCIgeDI9IjI1OC45NzgiIHkyPSIyNzguMzc1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q1NkFGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Ml9saW5lYXJfMjk1XzMwNjgiIHgxPSIxMDIuNzcxIiB5MT0iODMuMzg2NyIgeDI9IjEyOC45MTEiIHkyPSIxOTQuODA0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==";

class CustomAccount extends Account {
  async execute(
    compiledCalls: Call[],
    abis?: any,
    transactOptions?: any,
  ): Promise<any> {
    console.log("🔥 BurnerConnector: custom execute() called");

    if (typeof window === "undefined") {
      return Promise.reject(new Error("Window is not defined"));
    }

    console.log("Custom execute called", {
      compiledCalls,
      abis,
      transactOptions,
    });

    try {
      compiledCalls.forEach((element) => {
        //@ts-ignore
        element.calldata = CallData.compile(element.calldata);
        //@ts-ignore
        element.contractAddress = element.contract_address;
        //@ts-ignore
        element.entrypoint = element.entry_point;
      });

      return new Promise((resolve, reject) => {
        console.log("INSIDE PROMISE SENDING TRANSACTION....");

        const messageHandler = (event: MessageEvent) => {
          if (event.data.type === "TRANSACTION_RESPONSE") {
            window.removeEventListener("message", messageHandler);
            if (event.data.error) {
              reject(new Error(event.data.error));
            } else {
              resolve(event.data.result);
            }
          }
        };

        window.addEventListener("message", messageHandler);

        window.parent.postMessage(
          {
            type: "EXECUTE_TRANSACTION",
            calls: compiledCalls,
            options: { version: "0x3" },
          },
          "*",
        );
      });
    } catch (e) {
      throw e;
    }
  }
}

export class StarknetFinanceConnector extends InjectedConnector {
  chain: Chain = devnet;
  burnerAccount: BurnerAccount = burnerAccounts[0];
  private parentAddress: string | null = null;
  private messageHandler: ((event: MessageEvent) => void) | null = null;

  constructor() {
    console.log("🔥 BurnerConnector: constructor called");
    super({
      options: {
        id: burnerWalletId,
        name: burnerWalletName,
        icon: { dark: burnerWalletIcon, light: burnerWalletIcon },
      },
    });

    this.chain = scaffoldConfig.targetNetworks[0];

    if (typeof window !== "undefined") {
      this.messageHandler = (event: MessageEvent) => {
        if (event.data.type === "PARENT_ADDRESS") {
          this.parentAddress = event.data.address;
        }
      };

      window.addEventListener("message", this.messageHandler);
      window.parent.postMessage({ type: "GET_PARENT_ADDRESS" }, "*");
    }
  }

  get id(): string {
    console.log("🔥 BurnerConnector: id() called");
    return super.id;
  }

  get name(): string {
    console.log("🔥 BurnerConnector: name() called");
    return super.name;
  }

  async account(): Promise<AccountInterface> {
    console.log("🔥 BurnerConnector: account() called");

    if (typeof window === "undefined") {
      return Promise.reject(new Error("Window is not defined"));
    }

    // If we don't have parent address yet, wait for it
    if (!this.parentAddress) {
      await new Promise<void>((resolve) => {
        const checkAddress = setInterval(() => {
          if (this.parentAddress) {
            clearInterval(checkAddress);
            resolve();
          }
        }, 100);
      });
    }

    return Promise.resolve(
      new CustomAccount(
        new RpcProvider({
          nodeUrl: this.chain.rpcUrls.public.http[0],
          chainId: starknetChainId(this.chain.id),
        }),
        this.burnerAccount.accountAddress,
        this.burnerAccount.privateKey,
        "1",
      ),
    );
  }

  available(): boolean {
    return typeof window !== "undefined";
  }

  chainId(): Promise<bigint> {
    return Promise.resolve(this.chain.id);
  }

  get icon(): ConnectorIcons {
    return {
      dark: burnerWalletIcon,
      light: burnerWalletIcon,
    };
  }

  async ready(): Promise<boolean> {
    if (typeof window === "undefined") {
      return false;
    }
    return Promise.resolve(!!this.parentAddress);
  }

  async request<T extends RpcMessage["type"]>(
    call: RequestFnCall<T>,
  ): Promise<RpcTypeToMessageMap[T]["result"]> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("Window is not defined"));
    }

    console.log("INSIDE PROMISE SENDING TRANSACTION....");

    if (call.params && "calls" in call.params) {
      let compiledCalls = call.params.calls;
      try {
        compiledCalls.forEach((element) => {
          //@ts-ignore
          element.calldata = CallData.compile(element.calldata);
          //@ts-ignore
          element.contractAddress = element.contract_address;
          //@ts-ignore
          element.entrypoint = element.entry_point;
        });

        return new Promise((resolve, reject) => {
          console.log("INSIDE PROMISE SENDING TRANSACTION....");

          const messageHandler = (event: MessageEvent) => {
            if (event.data.type === "TRANSACTION_RESPONSE") {
              window.removeEventListener("message", messageHandler);
              if (event.data.error) {
                reject(new Error(event.data.error));
              } else {
                resolve(event.data.result);
              }
            }
          };

          window.addEventListener("message", messageHandler);

          window.parent.postMessage(
            {
              type: "EXECUTE_TRANSACTION",
              calls: compiledCalls,
              options: { version: "0x3" },
            },
            "*",
          );
        }) as any;
      } catch (e) {
        throw e;
      }
    }
    return await super.request(call);
  }

  async connect(): Promise<ConnectorData> {
    console.log("🔥 BurnerConnector: connect() called");

    if (typeof window === "undefined") {
      return Promise.reject(new Error("Window is not defined"));
    }

    // Wait for parent address if not set yet
    if (!this.parentAddress) {
      await new Promise<void>((resolve) => {
        const checkAddress = setInterval(() => {
          if (this.parentAddress) {
            clearInterval(checkAddress);
            resolve();
          }
        }, 100);
      });
    }

    return Promise.resolve({
      account: this.parentAddress!,
      chainId: this.chain.id,
    });
  }

  disconnect(): Promise<void> {
    console.log("🔥 BurnerConnector: disconnect() called");

    if (typeof window !== "undefined" && this.messageHandler) {
      window.removeEventListener("message", this.messageHandler);
      this.messageHandler = null;
    }

    this.parentAddress = null;
    return Promise.resolve();
  }
}
