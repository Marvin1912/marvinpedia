---
id: 11
name: k8s Custom Ressources
topic: kubernetes
fileName: k8s-custom-ressources
---

# Custom Resource Definitions (CRDs)

Kubernetes supports extending its API with **Custom Resource Definitions (CRDs)**. These are used by operators and other
controllers to introduce new types of resources beyond the built-in ones like Pods or Services.

To list all CRDs currently installed in your cluster use:

```
> kubectl get crds

NAME                                        CREATED AT
addons.k3s.cattle.io                        2025-03-08T10:28:56Z
alertmanagerconfigs.monitoring.coreos.com   2025-03-09T16:37:03Z
ingressroutetcps.traefik.io                 2025-03-08T10:29:28Z
ingressrouteudps.traefik.io                 2025-03-08T10:29:28Z
podmonitors.monitoring.coreos.com           2025-03-09T16:37:03Z
probes.monitoring.coreos.com                2025-03-09T16:37:03Z
prometheuses.monitoring.coreos.com          2025-03-09T16:37:04Z
prometheusrules.monitoring.coreos.com       2025-03-09T16:37:04Z
servicemonitors.monitoring.coreos.com       2025-03-09T16:37:04Z
```

This will show you all custom resource types registered in the cluster, along with their full names and API groups.

#### Viewing Resources from a CRD

Once the kind is known, it can be listed with:

```
kubectl get <resource-kind> -n <namespace>
```

```
> kubectl get servicemonitors.monitoring.coreos.com -n default

NAME                                             AGE
k8s-java-app-service-monitor                     22m
kube-prometheus-stack-alertmanager               12d
kube-prometheus-stack-apiserver                  12d
kube-prometheus-stack-coredns                    12d
kube-prometheus-stack-grafana                    12d
kube-prometheus-stack-kube-controller-manager    12d
```
