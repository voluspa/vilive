defmodule Exmud.Handlers.Builder do
  @behaviour :cowboy_http_handler

  def init(_type, req, _opts) do
    :lager.alskdj "woah i got initialized"
    {:ok, req, :undefined_state}
  end

  def handle(req, state) do
    {:ok, req} = :cowboy_req.reply(200, [], "Hello World!", req)
    {:ok, req, state}
  end

  def terminate(_reason, _req, _state) do
    :ok
  end
end
