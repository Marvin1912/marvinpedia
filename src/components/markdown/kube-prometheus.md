---
id: 12
name: Setup kube-prometheus
topic: kubernetes
fileName: kube-prometheus
---

# Introduction to kube-prometheus

[kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) is a collection of manifests that deploy a
complete monitoring stack for Kubernetes using the Prometheus Operator. It sets up Prometheus, Alertmanager, Grafana,
node-exporter, kube-state-metrics, and related configuration out of the box.

This project provides:

- A fully configured Prometheus Operator setup
- Monitoring for Kubernetes components and nodes
- Grafana dashboards and Prometheus alerts
- Support for custom application monitoring via ServiceMonitors and PodMonitors

To get started with helm:

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack --namespace default --create-namespace
```

## How a `ServiceMonitor` Works with a `Service`

A `ServiceMonitor` tells Prometheus (via the Prometheus Operator) what services to scrape for metrics.

1. The Prometheus Operator watches for ServiceMonitor resources.
2. It adds matching targets to Prometheus, based on the `serviceMonitorSelector` in the Prometheus CR.
3. The `ServiceMonitor` selects a `Service` using labels.
4. Prometheus Operator discovers the `ServiceMonitor`.
5. Prometheus scrapes the Pods behind that Service using the port and path defined.

#### 1. A labeled `Service`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    app: my-app
  ports:
    - name: http
      port: 80
      targetPort: 8080
```

#### 2. Matching `ServiceMonitor`:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-monitor
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
    - port: http
      path: /metrics
      interval: 15s
```

#### 3. Prometheus CR with `serviceMonitorSelector`:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
spec:
  serviceMonitorSelector:
    matchLabels:
      release: prometheus
```

