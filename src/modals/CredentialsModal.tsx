import { createSignal, Show, onMount } from "solid-js";
import { AppAuth, credentials, isConnected, apiStatus } from "../store/store";

export function CredentialsModal() {
  const [ip, setIp] = createSignal("");
  const [port, setPort] = createSignal("8212");
  const [username, setUsername] = createSignal("admin");
  const [password, setPassword] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal("");

  onMount(() => {
    const current = credentials();
    if (current.ip) setIp(current.ip);
    if (current.port) setPort(current.port);
    if (current.username) setUsername(current.username);
    if (current.password) setPassword(current.password);
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!ip() || !port() || !username() || !password()) return;
    setErrorMessage("");
    
    const success = await AppAuth.validateAndConnect({
      ip: ip().trim(),
      port: port().trim(),
      username: username().trim(),
      password: password()
    });

    if (!success) {
      setErrorMessage("Connection failed. Please check your credentials, IP, Port and if the REST API is enabled.");
    }
  };

  const isConnecting = () => apiStatus() === 'connecting';

  return (
    <div class={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-all duration-300 ${
      !isConnected() ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}>
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h3 class="text-lg font-bold text-slate-200 mb-1">Connect to Palworld Server</h3>
        <p class="text-xs text-slate-400 mb-6">Enter your server's REST API details to access the dashboard.</p>
        
        <form onSubmit={handleSubmit} class="space-y-4">
          
          <Show when={errorMessage()}>
            <div class="p-3 bg-rose-950/40 border border-rose-900/50 rounded-lg text-xs text-rose-400 font-medium">
              {errorMessage()}
            </div>
          </Show>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Server IP</label>
            <input 
              type="text" 
              placeholder="123.456.78.9" 
              value={ip()} 
              disabled={isConnecting()}
              onInput={(e) => { setErrorMessage(""); setIp(e.currentTarget.value); }}
              class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-200 disabled:opacity-50 transition"
              required 
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">API Port</label>
            <input 
              type="text" 
              placeholder="8212" 
              value={port()} 
              disabled={isConnecting()}
              onInput={(e) => { setErrorMessage(""); setPort(e.currentTarget.value); }}
              class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-200 disabled:opacity-50 transition"
              required 
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">API Admin Username</label>
            <input 
              type="text" 
              placeholder="admin" 
              value={username()} 
              disabled={isConnecting()}
              onInput={(e) => { setErrorMessage(""); setUsername(e.currentTarget.value); }}
              class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-200 disabled:opacity-50 transition"
              required 
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">API Admin Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password()} 
              disabled={isConnecting()}
              onInput={(e) => { setErrorMessage(""); setPassword(e.currentTarget.value); }}
              class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-200 disabled:opacity-50 transition"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isConnecting()}
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 font-semibold rounded-lg text-sm transition mt-2 shadow-lg flex items-center justify-center space-x-2"
          >
            <Show when={isConnecting()} fallback={<span>Connect Dashboard</span>}>
              <div class="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </Show>
          </button>
        </form>
      </div>
    </div>
  );
}