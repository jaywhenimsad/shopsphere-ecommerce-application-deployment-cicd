# Kubernetes phase placeholder

We will add namespace-scoped resources here after inspecting the existing kubeadm cluster. Do not apply manifests until image names, storage class, ingress controller, and cluster access have been checked.

Planned resources:
- namespace `ecommerce`
- MongoDB StatefulSet + PersistentVolumeClaim + internal Service
- backend Deployment + internal Service
- frontend Deployment + Service
- Ingress or a verified external access method
- Secrets and ConfigMaps
