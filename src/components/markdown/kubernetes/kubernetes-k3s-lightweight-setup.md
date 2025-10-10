---
id: 10
name: k3s Setup
topic: kubernetes
fileName: kubernetes/kubernetes-k3s-lightweight-setup
---

# K3s - Lightweight Kubernetes

[K3s](https://k3s.io/) is a lightweight, fully compliant Kubernetes distribution designed for resource-constrained
environments, edge computing, IoT devices, and development use cases. It is a simplified and optimized version of
Kubernetes, developed by SUSE Rancher, to provide an easy-to-deploy and efficient Kubernetes experience.

The following is merely intended to provide an overview of how k3s can be installed locally quickly and easily in order
to test something with the environment.

## Getting Started

### Installation

To install K3s, run the following command on your Linux machine:

```bash
curl -sfL https://get.k3s.io | sh -
```

This command downloads and installs K3s, setting up a fully functional Kubernetes cluster in minutes.

### Kubectl

k3s packs the configuration for kubectl under the path `/etc/rancher/k3s/k3s.yaml`. The file is assigned to the root
user. So that kubectl can be executed without root rights, some changes need to be done.

```bash
mkdir -p ~/.kube/config

sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config

sudo chown $USER:$USER ~/.kube/config/k3s.yaml

export KUBECONFIG=~/.kube/config/k3s.yaml
```

Basically, the config is simply copied to the local kube directory and made accessible to the user. It should be noted
that `KUBECONFIG ` is set within ~/.bashrc, for example, so that the config also survives a logout.

### Local Container Registry

So that images can be loaded from the local (or another container registry), this must be stored in the configuration of
k3s. The configuration is located under `/etc/rancher/k3s/registries.yaml` or must be created if it does not exist. The
following is an example of a local registry.

```yaml
mirrors:
  "192.168.178.29:5000":
    endpoint:
      - "http://192.168.178.29:5000"
```

At this point it should also be noted that in order to successfully push an image to the local registry, this must be
entered under `/etc/docker/daemon.json`. Provided, of course, that no TLS is to be used.

```json
{
    "insecure-registries" : ["192.168.178.29:5000"]
}
```

### Ingress (Application Access)

If applications are deployed in the cluster and have an HTTP interface (or similar), they can simply be addressed via
the [Traefik](https://doc.traefik.io/traefik/) application proxy supplied. Traefik offers two default endpoints:

- web on port 80
- websecure on port 443

The CustomResource `IngressRoute` can be used to address a dedicated service. The `namespace` must be the one in
which the services run. Traefik is able to address the service across namespaces (Traefik runs in namespace `kube-system`).

```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: kube-test
  namespace: default
spec:
  entryPoints:
    - web
  routes:
  - match: Host(`prometheus.kube.test.com`)
    kind: Rule
    services:
      - kind: Service
        name: kube-prometheus-stack-prometheus
        port: 9090
  - match: Host(`grafana.kube.test.com`)
    kind: Rule
    services:
      - kind: Service
        name: kube-prometheus-stack-grafana
        port: 80
```

It is important to know that the hostname must be set accordingly in the host file or as a header. A service can
then be accessed (f.e.) via `http://prometheus.kube.test.com`.
